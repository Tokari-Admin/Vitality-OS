"use server"

import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/database.types"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

type DailyInputInsert = Database["public"]["Tables"]["daily_inputs"]["Insert"]
type ProtocolInsert = Database["public"]["Tables"]["protocols"]["Insert"]
type WeeklyTargetInsert = Database["public"]["Tables"]["weekly_targets"]["Insert"]
type DailyLedgerInsert = Database["public"]["Tables"]["daily_ledger"]["Insert"]
type ProtocolUpdate = Database["public"]["Tables"]["protocols"]["Update"]

type DailyLogData = {
    date: string
    weight: number
    body_fat_pct?: number
    calories: number
    protein: number
    hydration_liters: number
    sports_calories_burned: number
    training: boolean
    sleep: boolean
}

// Log Daily Inputs
export async function logDailyMetrics(data: DailyLogData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        // 1. Upsert Input
        const inputPayload: DailyInputInsert = {
            user_id: user.id,
            date: data.date,
            weight_kg: data.weight,
            body_fat_pct: data.body_fat_pct ?? null,
            calories_consumed: data.calories,
            protein_consumed: data.protein,
            hydration_liters: data.hydration_liters,
            active_calories_burned: data.sports_calories_burned,
            training_completed: data.training,
            is_sleep_adequate: data.sleep,
            sleep_quality_score: data.sleep ? 4 : 2
        }
        const { data: inputData, error: inputError } = await supabase
            .from("daily_inputs")
            .upsert(inputPayload as never, { onConflict: "user_id, date" })
            .select()
            .single()

        if (inputError) throw inputError

        // 2. Find/Create Protocol
        type ProtocolIdRow = { id: string }
        let { data: protocolData } = await supabase
            .from("protocols")
            .select("id")
            .eq("user_id", user.id)
            .eq("status", "ACTIVE")
            .single()
        let protocol = protocolData as ProtocolIdRow | null

        if (!protocol) {
            // Auto-create default if missing
            const protocolPayload: ProtocolInsert = {
                user_id: user.id,
                status: "ACTIVE",
                goal_type: "FAT_LOSS",
                start_date: new Date().toISOString().split("T")[0],
                initial_weight_kg: data.weight,
            }
            const { data: newProtocolData } = await supabase
                .from("protocols")
                .insert(protocolPayload as never)
                .select()
                .single()
            const newProtocol = newProtocolData as ProtocolIdRow | null
            protocol = newProtocol

            if (protocol) {
                const targetPayload: WeeklyTargetInsert = {
                    protocol_id: protocol.id,
                    week_number: 1,
                    start_date: new Date().toISOString().split("T")[0],
                    end_date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
                    daily_calories_target: 2200,
                    daily_protein_target: 180,
                    hydration_target_l: 3.5,
                    daily_steps_target: 10000
                }
                await supabase.from("weekly_targets").insert(targetPayload as never)
            }
        }

        type WeeklyTargetRow = Database["public"]["Tables"]["weekly_targets"]["Row"]
        const { data: targetData } = await supabase
            .from("weekly_targets")
            .select("*")
            .eq("protocol_id", protocol?.id || "")
            .gte("end_date", data.date)
            .lte("start_date", data.date)
            .maybeSingle()
        let currentTarget = targetData as WeeklyTargetRow | null

        if (!currentTarget && protocol) {
            const { data: latestTargetData } = await supabase
                .from("weekly_targets")
                .select("*")
                .eq("protocol_id", protocol.id)
                .order("week_number", { ascending: false })
                .limit(1)
                .single()
            currentTarget = latestTargetData as WeeklyTargetRow | null
        }

        const T_CALORIES = currentTarget?.daily_calories_target || 2000
        const T_PROTEIN = currentTarget?.daily_protein_target || 150
        const T_HYDRATION = currentTarget?.hydration_target_l || 3.0

        // 4. Scoring Algorithm
        const calDiff = Math.abs(data.calories - T_CALORIES)
        const calAdherence = calDiff / T_CALORIES
        let scoreEnergy = calAdherence <= 0.05 ? 35 : calAdherence <= 0.15 ? 25 : calAdherence <= 0.25 ? 10 : 0

        let scoreProtein = 0
        if (data.protein >= T_PROTEIN - 10) scoreProtein = 20
        else if (data.protein >= T_PROTEIN - 30) scoreProtein = 10

        let scoreRecovery = data.sleep ? 20 : 0
        let scoreTraining = data.training ? 10 : 0
        let scoreHydration = (data.hydration_liters >= T_HYDRATION - 0.5) ? 10 : 0
        let scoreSignals = 5

        const totalScore = scoreEnergy + scoreProtein + scoreRecovery + scoreTraining + scoreHydration + scoreSignals
        let label = "OFF_TRACK"
        if (totalScore >= 90) label = "OPTIMAL"
        else if (totalScore >= 75) label = "ON_TRACK"
        else if (totalScore >= 60) label = "AT_RISK"

        // 5. TDEE & Ledger
        const baseBMR = 22 * data.weight
        const tef = data.calories * 0.1
        const neat = 300
        const calculatedTDEE = Math.round(baseBMR + tef + neat + data.sports_calories_burned)
        const netDeficit = calculatedTDEE - data.calories

        // Deficit Attainment % (Actual Deficit / Target Deficit)
        const targetDeficit = calculatedTDEE - T_CALORIES
        let deficitAttainment = 0
        if (targetDeficit > 0) {
            deficitAttainment = Math.min((netDeficit / targetDeficit) * 100, 150) // Cap at 150%
        } else if (targetDeficit === 0 && netDeficit >= 0) {
            deficitAttainment = 100
        }

        type DailyInputRow = Database["public"]["Tables"]["daily_inputs"]["Row"]
        const inputRow = inputData as DailyInputRow
        const ledgerPayload: DailyLedgerInsert = {
            input_id: inputRow.id,
            date: data.date,
            target_calories: T_CALORIES,
            target_protein: T_PROTEIN,
            calculated_tdee: calculatedTDEE,
            net_deficit: netDeficit,
            deficit_adherence_pct: deficitAttainment,
            execution_score: totalScore,
            execution_label: label as DailyLedgerInsert["execution_label"]
        }
        const { error: ledgerError } = await supabase.from("daily_ledger").upsert(ledgerPayload as never, { onConflict: "input_id" })

        if (ledgerError) throw ledgerError

        revalidatePath("/")
        revalidatePath("/dashboard")
        revalidatePath("/history")

        return {
            success: true,
            score: totalScore,
            label,
            details: {
                tdee: calculatedTDEE,
                deficit: netDeficit,
                calAchievementPct: Math.round((data.calories / T_CALORIES) * 100),
                proteinAchievementPct: Math.round((data.protein / T_PROTEIN) * 100),
                goalCalories: T_CALORIES,
                goalProtein: T_PROTEIN
            }
        }

    } catch (err: any) {
        console.error("Log Error:", err)
        return { success: false, message: err.message || "Failed to log" }
    }
}

// Update Protocol Goals
export async function updateProtocol(data: {
    goal_type: string,
    goal_weight_kg: number | null,
    goal_bodyfat_pct: number | null,
    initial_weight_kg: number | null,
    initial_bodyfat_pct: number | null
}) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, message: "Unauthorized" }

    try {
        type ProtocolIdRow = { id: string }
        const { data: protocolData } = await supabase
            .from("protocols")
            .select("id")
            .eq("user_id", user.id)
            .eq("status", "ACTIVE")
            .single()
        const protocol = protocolData as ProtocolIdRow | null

        if (protocol) {
            const updatePayload: ProtocolUpdate = {
                goal_type: data.goal_type as ProtocolUpdate["goal_type"],
                goal_weight_kg: data.goal_weight_kg,
                goal_bodyfat_pct: data.goal_bodyfat_pct,
                initial_weight_kg: data.initial_weight_kg,
                initial_bodyfat_pct: data.initial_bodyfat_pct,
            }
            const { error } = await supabase
                .from("protocols")
                .update(updatePayload as never)
                .eq("id", protocol.id)

            if (error) throw error
        } else {
            const insertPayload: ProtocolInsert = {
                user_id: user.id,
                status: "ACTIVE",
                goal_type: data.goal_type as ProtocolInsert["goal_type"],
                goal_weight_kg: data.goal_weight_kg,
                goal_bodyfat_pct: data.goal_bodyfat_pct,
                initial_weight_kg: data.initial_weight_kg,
                initial_bodyfat_pct: data.initial_bodyfat_pct,
                start_date: new Date().toISOString().split("T")[0]
            }
            const { error } = await supabase
                .from("protocols")
                .insert(insertPayload as never)

            if (error) throw error
        }

        revalidatePath("/dashboard")
        revalidatePath("/settings")
        return { success: true }
    } catch (err: any) {
        console.error("Update Protocol Error:", err)
        return { success: false, message: err.message }
    }
}