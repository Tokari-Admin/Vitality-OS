import { InputEngine } from "@/components/input-engine"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, Activity, ArrowRight, Gauge, Scale } from "lucide-react"
import type { Database } from "@/lib/database.types"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type ProtocolRow = Database["public"]["Tables"]["protocols"]["Row"]
type DailyInputRow = Database["public"]["Tables"]["daily_inputs"]["Row"]
type DailyLedgerRow = Database["public"]["Tables"]["daily_ledger"]["Row"]

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    // Check Active Protocol for Goals
    const { data } = await supabase
        .from("protocols")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "ACTIVE")
        .maybeSingle()

    const protocol = data as ProtocolRow | null

    // If no protocol active, redirect to onboarding
    if (!protocol) {
        redirect("/settings?onboarding=true")
    }

    // If no valid goals set, force settings
    if (!protocol.goal_weight_kg && !protocol.goal_bodyfat_pct) {
        redirect("/settings?onboarding=true")
    }

    // Fetch Latest Input to show progress
    const { data: latestInputData } = await supabase
        .from("daily_inputs")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle()
    const latestInput = latestInputData as DailyInputRow | null

    // Fetch Latest Score for the Dashboard header
    const { data: latestLedgerData } = await supabase
        .from("daily_ledger")
        .select("*")
        .order("date", { ascending: false })
        .limit(1)
        .maybeSingle()
    const latestLedger = latestLedgerData as DailyLedgerRow | null

    // Progress Calculations
    const currentWeight = latestInput?.weight_kg || protocol.initial_weight_kg || 0
    const startWeight = protocol.initial_weight_kg || 0
    const targetWeight = protocol.goal_weight_kg || 0

    let weightProgressPcnt = 0
    if (startWeight !== targetWeight) {
        weightProgressPcnt = Math.abs(((startWeight - currentWeight) / (startWeight - targetWeight)) * 100)
    }

    return (
        <div className="space-y-8">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Metabolic Steering</h2>
                    <p className="text-slate-400 text-sm">Protocol: <span className="text-indigo-400 font-mono">{protocol.goal_type?.replace('_', ' ')}</span></p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-4">
                    <div className="text-right">
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Date</div>
                        <div className="text-sm text-slate-300 font-mono">
                            {format(new Date(), 'MMM dd, yyyy')}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Dashboard (Left 2 cols) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Status Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Gauge className="h-12 w-12 text-indigo-400" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Execution Hub</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className={cn(
                                    "text-2xl font-bold mb-1",
                                    latestLedger?.execution_label === 'OPTIMAL' ? 'text-green-400' :
                                        latestLedger?.execution_label === 'ON_TRACK' ? 'text-indigo-400' : 'text-red-400'
                                )}>
                                    {latestLedger?.execution_label?.replace('_', ' ') || 'No Data'}
                                </div>
                                <div className="text-xs text-slate-500 font-mono">
                                    Score: {latestLedger?.execution_score || 0}%
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm relative group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Scale className="h-12 w-12 text-indigo-400" />
                            </div>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Weight Goal</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white mb-1">
                                    {currentWeight} <span className="text-sm font-normal text-slate-500">/ {targetWeight} kg</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min(weightProgressPcnt, 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-mono text-indigo-400">{Math.round(weightProgressPcnt)}%</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Body Fat Goal</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white mb-1">
                                    {latestInput?.body_fat_pct || protocol.initial_bodyfat_pct || '—'}
                                    <span className="text-sm font-normal text-slate-500"> / {protocol.goal_bodyfat_pct || '—'}%</span>
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3 text-red-400 rotate-180" />
                                    Starting at {protocol.initial_bodyfat_pct}%
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-8 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 bg-indigo-500/10 rounded-full blur-3xl" />

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-indigo-400" />
                                    Daily Trace Protocol
                                </h3>
                                <p className="text-slate-400 text-sm max-w-md">
                                    Your metrics are currently tracking towards a <span className="text-white font-medium">{format(new Date(Date.now() + 15 * 86400000), 'MMM dd')}</span> goal completion window.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
                                <div>
                                    <span className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Target Deficit</span>
                                    <div className="text-white text-2xl font-mono">
                                        {(latestLedger?.calculated_tdee || 2800) - (latestLedger?.target_calories || 2200)}
                                        <span className="text-xs text-slate-500 ml-1">kcal</span>
                                    </div>
                                </div>
                                <div className="hidden lg:block">
                                    <span className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Protein Floor</span>
                                    <div className="text-white text-2xl font-mono">
                                        {latestLedger?.target_protein || 180}
                                        <span className="text-xs text-slate-500 ml-1">g</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-slate-500 text-[10px] uppercase font-bold mb-1">Status</span>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] uppercase font-bold tracking-widest">
                                        Active
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Col: Input Engine */}
                <div>
                    <InputEngine />
                </div>

            </div>
        </div>
    )
}
