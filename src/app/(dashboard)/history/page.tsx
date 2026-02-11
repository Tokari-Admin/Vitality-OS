import type { Database } from "@/lib/database.types"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { TrendingDown, TrendingUp, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

type DailyLedgerRow = Database["public"]["Tables"]["daily_ledger"]["Row"]
type HistoryEntry = DailyLedgerRow & {
    daily_inputs: { weight_kg: number | null; calories_consumed: number | null; protein_consumed: number | null } | null
}

export default async function HistoryPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    // Fetch ledger entries with input data
    const { data: historyData, error } = await supabase
        .from("daily_ledger")
        .select(`
            *,
            daily_inputs (
                weight_kg,
                calories_consumed,
                protein_consumed
            )
        `)
        .order("date", { ascending: false })

    const history = historyData as HistoryEntry[] | null

    if (error) {
        console.error("History fetch error:", error)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Metabolic Ledger</h1>
                <p className="text-slate-400">Chronological summary of your metabolic execution.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Weight</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Deficit %</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Net Deficit</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Score</th>
                                <th className="px-6 py-4 font-medium uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {history && history.length > 0 ? (
                                history.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 text-white font-mono">
                                            {format(new Date(entry.date), "MMM dd, yyyy")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-200">
                                                    {entry.daily_inputs?.weight_kg ?? '—'}
                                                    <span className="text-xs text-slate-500 ml-1">kg</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "font-mono text-xs px-2 py-0.5 rounded",
                                                    (entry.deficit_adherence_pct || 0) >= 90 ? "bg-green-500/10 text-green-400" :
                                                        (entry.deficit_adherence_pct || 0) >= 70 ? "bg-indigo-500/10 text-indigo-400" :
                                                            "bg-red-500/10 text-red-400"
                                                )}>
                                                    {Math.round(entry.deficit_adherence_pct || 0)}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {entry.net_deficit && entry.net_deficit > 0 ? (
                                                    <span className="text-green-400 flex items-center gap-1 font-mono">
                                                        <TrendingDown className="h-3 w-3" />
                                                        {entry.net_deficit}
                                                    </span>
                                                ) : (
                                                    <span className="text-red-400 flex items-center gap-1 font-mono">
                                                        <TrendingUp className="h-3 w-3" />
                                                        {Math.abs(entry.net_deficit || 0)}
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-slate-500 uppercase">kcal</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${(entry.execution_score || 0) >= 90 ? 'bg-green-500' :
                                                            (entry.execution_score || 0) >= 75 ? 'bg-indigo-500' :
                                                                (entry.execution_score || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${entry.execution_score ?? 0}%` }}
                                                    />
                                                </div>
                                                <span className="font-bold text-white font-mono w-8">{entry.execution_score}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${entry.execution_label === 'OPTIMAL' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                entry.execution_label === 'ON_TRACK' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                                    entry.execution_label === 'AT_RISK' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                        'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}>
                                                {entry.execution_label?.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-6 py-12 text-center text-slate-500 font-mono italic" colSpan={6}>
                                        No metabolic data recorded in history.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
