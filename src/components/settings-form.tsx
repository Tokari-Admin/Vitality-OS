"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { updateProtocol } from "@/app/actions"
import { AlertCircle, CheckCircle, Percent, Scale, Target } from "lucide-react"

export function SettingsForm({ initialData }: { initialData: any }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const isOnboarding = searchParams.get('onboarding') === 'true'

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [goalType, setGoalType] = useState(initialData?.goal_type || 'FAT_LOSS')
    const [targetWeight, setTargetWeight] = useState(initialData?.goal_weight_kg || '')
    const [targetBodyFat, setTargetBodyFat] = useState(initialData?.goal_bodyfat_pct || '')
    const [startWeight, setStartWeight] = useState(initialData?.initial_weight_kg || '')
    const [startBodyFat, setStartBodyFat] = useState(initialData?.initial_bodyfat_pct || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const result = await updateProtocol({
            goal_type: goalType,
            goal_weight_kg: targetWeight ? parseFloat(targetWeight) : null,
            goal_bodyfat_pct: targetBodyFat ? parseFloat(targetBodyFat) : null,
            initial_weight_kg: startWeight ? parseFloat(startWeight) : null,
            initial_bodyfat_pct: startBodyFat ? parseFloat(startBodyFat) : null,
        })

        if (result.success) {
            setMessage({ type: 'success', text: 'Protocol updated successfully' })
            if (isOnboarding) {
                router.push("/")
            } else {
                router.refresh()
            }
        } else {
            setMessage({ type: 'error', text: result.message || 'Failed to update' })
        }
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-1">
                        <Target className="h-5 w-5 text-indigo-400" />
                        <CardTitle className="text-white">Metabolic Goals</CardTitle>
                    </div>
                    <CardDescription className="text-slate-400">
                        {isOnboarding
                            ? "Set your targets to initialize your metabolic trajectory."
                            : "Adjust your targets to recalibrate your progression."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-slate-300">Goal Type</Label>
                        <select
                            value={goalType}
                            onChange={(e) => setGoalType(e.target.value)}
                            className="w-full h-10 px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'white\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
                        >
                            <option value="FAT_LOSS" className="bg-slate-950">Fat Loss (Cut)</option>
                            <option value="RECOMP" className="bg-slate-950">Recomposition</option>
                            <option value="GAIN" className="bg-slate-950">Muscle Gain (Bulk)</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {/* Starting State */}
                        <div className="space-y-4 p-4 rounded-lg bg-slate-950/30 border border-slate-800/50">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Starting State</h3>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 flex items-center gap-1.5">
                                        <Scale className="h-3.5 w-3.5" /> Starting Weight (kg)
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="e.g. 85.0"
                                        value={startWeight}
                                        onChange={(e) => setStartWeight(e.target.value)}
                                        className="bg-slate-950/50 border-slate-800 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 flex items-center gap-1.5">
                                        <Percent className="h-3.5 w-3.5" /> Starting Body Fat %
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="e.g. 22.0"
                                        value={startBodyFat}
                                        onChange={(e) => setStartBodyFat(e.target.value)}
                                        className="bg-slate-950/50 border-slate-800 text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Targets */}
                        <div className="space-y-4 p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Metabolic Targets</h3>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-slate-400 flex items-center gap-1.5">
                                        <Scale className="h-3.5 w-3.5" /> Target Weight (kg)
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="e.g. 75.0"
                                        value={targetWeight}
                                        onChange={(e) => setTargetWeight(e.target.value)}
                                        className="bg-slate-950/50 border-slate-800 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400 flex items-center gap-1.5">
                                        <Percent className="h-3.5 w-3.5" /> Target Body Fat %
                                    </Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        placeholder="e.g. 12.0"
                                        value={targetBodyFat}
                                        onChange={(e) => setTargetBodyFat(e.target.value)}
                                        className="bg-slate-950/50 border-slate-800 text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-md text-sm flex items-center gap-2 animate-in fade-in duration-300 ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                            {message.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            {message.text}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="pt-2">
                    <Button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white hover:bg-indigo-500 font-bold py-6">
                        {loading ? 'Processing Trajectory...' : 'Initialize Metabolic Protocol'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
