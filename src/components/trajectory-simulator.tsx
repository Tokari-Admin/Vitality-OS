"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts"
import { format, addDays } from "date-fns"
import { Info, Calculator, TrendingDown, Target } from "lucide-react"

interface Props {
    initialWeight: number
    initialBF: number
    targetCalories: number
    targetProtein: number
}

export function TrajectorySimulator({
    initialWeight,
    initialBF,
    targetCalories,
    targetProtein
}: Props) {
    const [simWeight, setSimWeight] = useState(initialWeight)
    const [simBF, setSimBF] = useState(initialBF)
    const [simCalories, setSimCalories] = useState(targetCalories)
    const [simActivity, setSimActivity] = useState(400) // Default sports burn
    const [weeks, setWeeks] = useState(12)

    const simulationData = useMemo(() => {
        const data = []
        let currentWeight = simWeight
        let currentBF = simBF
        const startDate = new Date()

        // Metabolic Constants
        const neat = 300
        const kcalPerKgFat = 7700

        for (let day = 0; day <= weeks * 7; day++) {
            // Recalculate TDEE based on current weight
            const bmr = 22 * currentWeight
            const tef = simCalories * 0.1
            const tdee = bmr + tef + neat + simActivity
            const deficit = tdee - simCalories

            // Simplified weight loss: mostly fat
            const lossKg = deficit / kcalPerKgFat

            // Every week, we record for the chart
            if (day % 7 === 0) {
                const fatMass = currentWeight * (currentBF / 100)
                const leanMass = currentWeight - fatMass

                // Simplified: assume 80% fat loss, 20% lean loss if deficit is high
                const fatLoss = lossKg * 0.8 * 7
                const leanLoss = lossKg * 0.2 * 7

                data.push({
                    day,
                    date: format(addDays(startDate, day), "MMM dd"),
                    weight: Number(currentWeight.toFixed(1)),
                    bodyFat: Number(currentBF.toFixed(1)),
                    leanMass: Number(leanMass.toFixed(1))
                })

                // Update for next iteration
                currentWeight -= (fatLoss + leanLoss)
                const newFatMass = Math.max(0, fatMass - fatLoss)
                currentBF = (newFatMass / currentWeight) * 100
            }
        }
        return data
    }, [simWeight, simBF, simCalories, simActivity, weeks])

    const totalWeightLoss = (simWeight - simulationData[simulationData.length - 1].weight).toFixed(1)
    const totalBFLoss = (simBF - simulationData[simulationData.length - 1].bodyFat).toFixed(1)

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Controls */}
                <Card className="lg:col-span-1 bg-slate-900/40 border-slate-800 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                            <Calculator className="h-4 w-4" />
                            Simulation Inputs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-xs text-slate-500">Starting Weight (kg)</Label>
                            <Input
                                type="number"
                                value={simWeight}
                                onChange={(e) => setSimWeight(Number(e.target.value))}
                                className="bg-slate-950/50 border-slate-800"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs text-slate-500">Starting Body Fat (%)</Label>
                            <Input
                                type="number"
                                value={simBF}
                                onChange={(e) => setSimBF(Number(e.target.value))}
                                className="bg-slate-950/50 border-slate-800"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs text-slate-500">Daily Calories (kcal)</Label>
                            <Input
                                type="number"
                                value={simCalories}
                                onChange={(e) => setSimCalories(Number(e.target.value))}
                                className="bg-slate-950/50 border-slate-800"
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-xs text-slate-500">Sports Burn (kcal/day)</Label>
                                <span className="text-xs text-indigo-400 font-mono">{simActivity}</span>
                            </div>
                            <Slider
                                value={[simActivity]}
                                onValueChange={(v) => setSimActivity(v[0])}
                                max={1500}
                                step={50}
                                className="py-4"
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <Label className="text-xs text-slate-500">Duration (Weeks)</Label>
                                <span className="text-xs text-indigo-400 font-mono">{weeks}</span>
                            </div>
                            <Slider
                                value={[weeks]}
                                onValueChange={(v) => setWeeks(v[0])}
                                min={4}
                                max={52}
                                step={1}
                                className="py-4"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Chart & Results */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Fast Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-indigo-500/5 border-indigo-500/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Predicted Weight Loss</p>
                                        <div className="text-3xl font-bold text-white font-mono">-{totalWeightLoss}kg</div>
                                    </div>
                                    <TrendingDown className="h-8 w-8 text-indigo-400 opacity-20" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-emerald-500/5 border-emerald-500/20">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Predicted BF% Reduction</p>
                                        <div className="text-3xl font-bold text-white font-mono">-{totalBFLoss}%</div>
                                    </div>
                                    <Target className="h-8 w-8 text-emerald-400 opacity-20" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chart */}
                    <Card className="bg-slate-900/40 border-slate-800 p-6">
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={simulationData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={['dataMin - 2', 'dataMax + 2']}
                                        label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft', offset: 10, fill: '#64748b', fontSize: 10 }}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={['dataMin - 1', 'dataMax + 1']}
                                        label={{ value: 'Body Fat (%)', angle: 90, position: 'insideRight', offset: 10, fill: '#64748b', fontSize: 10 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                                        itemStyle={{ fontSize: '12px' }}
                                    />
                                    <Legend />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="weight"
                                        name="Weight (kg)"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2, fill: '#0f172a' }}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="bodyFat"
                                        name="Body Fat (%)"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#0f172a' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex items-start gap-2 text-[10px] text-slate-500 uppercase tracking-wider">
                            <Info className="h-3 w-3 mt-0.5" />
                            Simulation assumes 80/20 fat-to-lean mass loss ratio and adapts BMR as weight decreases.
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
