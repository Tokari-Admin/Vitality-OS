import type { Database } from "@/lib/database.types"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { TrajectorySimulator } from "@/components/trajectory-simulator"

type ProtocolRow = Database["public"]["Tables"]["protocols"]["Row"]
type WeeklyTargetRow = Database["public"]["Tables"]["weekly_targets"]["Row"]

export default async function TrajectoryPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    // Fetch Active Protocol for initial values
    const { data: protocolData } = await supabase
        .from("protocols")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "ACTIVE")
        .single()

    const protocol = protocolData as ProtocolRow | null
    if (!protocol) {
        redirect("/settings?onboarding=true")
    }

    // Fetch targets for simulation defaults
    const { data: weeklyTargetsData } = await supabase
        .from("weekly_targets")
        .select("*")
        .eq("protocol_id", protocol.id)
        .order("week_number", { ascending: false })
        .limit(1)
        .single()

    const weeklyTargets = weeklyTargetsData as WeeklyTargetRow | null

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white font-mono uppercase">Metabolic Trajectory</h1>
                    <p className="text-slate-400">Predictive analysis of your weight and body fat trends.</p>
                </div>
            </div>

            <TrajectorySimulator
                initialWeight={protocol.initial_weight_kg || 80}
                initialBF={protocol.initial_bodyfat_pct || 20}
                targetCalories={weeklyTargets?.daily_calories_target || 2000}
                targetProtein={weeklyTargets?.daily_protein_target || 160}
            />
        </div>
    )
}
