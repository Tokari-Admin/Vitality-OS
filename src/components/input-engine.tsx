"use client"

import * as React from "react"
import { Check, Dumbbell, Moon, Utensils, Scale, Activity, Droplets, Flame, Percent } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { logDailyMetrics } from "@/app/actions"
import { toast } from "sonner"

export function InputEngine() {
    const [date, setDate] = React.useState<string>(new Date().toISOString().split("T")[0])
    const [weight, setWeight] = React.useState<string>("")
    const [bodyFat, setBodyFat] = React.useState<string>("")
    const [calories, setCalories] = React.useState<string>("")
    const [protein, setProtein] = React.useState<string>("")
    const [hydration, setHydration] = React.useState<string>("")
    const [sportsBurn, setSportsBurn] = React.useState<string>("")
    const [training, setTraining] = React.useState<boolean>(false)
    const [sleep, setSleep] = React.useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // Result state now includes calculated details
    const [result, setResult] = React.useState<{
        score: number,
        label: string,
        details?: {
            tdee: number,
            deficit: number,
            calAchievementPct: number,
            proteinAchievementPct: number,
            goalCalories: number,
            goalProtein: number
        }
    } | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const payload = {
            date,
            weight: parseFloat(weight),
            body_fat_pct: bodyFat ? parseFloat(bodyFat) : undefined,
            calories: parseInt(calories),
            protein: parseInt(protein),
            hydration_liters: parseFloat(hydration || "0"),
            sports_calories_burned: sportsBurn ? parseInt(sportsBurn) : 0,
            training,
            sleep
        }

        const response = await logDailyMetrics(payload)

        setIsSubmitting(false)

        if (response.success && response.score !== undefined && response.label) {
            setResult({
                score: response.score,
                label: response.label,
                details: response.details
            })
        } else {
            if (response.message === 'Unauthorized') {
                alert("Session expired. Redirecting to login...")
                window.location.href = '/login'
            } else {
                alert(response.message || "Failed to log data")
            }
        }
    }

    if (result) {
        return (
            <Card className="w-full max-w-md mx-auto glass-panel border-white/10 shadow-2xl animate-in zoom-in-95 duration-500">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Activity className="h-6 w-6 text-primary" />
                        Daily Execution
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-4 space-y-6">
                    {/* Score Circle */}
                    <div className="relative flex items-center justify-center">
                        <svg className="h-32 w-32 transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-slate-800"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={351}
                                strokeDashoffset={351 - (351 * result.score) / 100}
                                className={cn(
                                    "transition-all duration-1000 ease-out",
                                    result.score >= 90 ? "text-green-500" :
                                        result.score >= 75 ? "text-blue-500" :
                                            result.score >= 60 ? "text-yellow-500" : "text-red-500"
                                )}
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-extrabold text-white">{result.score}%</span>
                            <span className={cn(
                                "text-xs font-bold uppercase tracking-wider mt-1",
                                result.score >= 90 ? "text-green-400" :
                                    result.score >= 75 ? "text-blue-400" :
                                        result.score >= 60 ? "text-yellow-400" : "text-red-400"
                            )}>{result.label}</span>
                        </div>
                    </div>

                    {/* Detailed Stats Grid */}
                    {result.details && (
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <div className="bg-slate-900/40 p-3 rounded-lg border border-white/5 space-y-1">
                                <p className="text-xs text-slate-400">Calorie Achievement</p>
                                <p className={cn(
                                    "text-lg font-bold",
                                    Math.abs(result.details.calAchievementPct - 100) <= 10 ? "text-green-400" : "text-yellow-400"
                                )}>{result.details.calAchievementPct}%</p>
                                <p className="text-[10px] text-slate-500">Goal: {result.details.goalCalories}</p>
                            </div>
                            <div className="bg-slate-900/40 p-3 rounded-lg border border-white/5 space-y-1">
                                <p className="text-xs text-slate-400">Protein Achievement</p>
                                <p className={cn(
                                    "text-lg font-bold",
                                    result.details.proteinAchievementPct >= 95 ? "text-green-400" : "text-yellow-400"
                                )}>{result.details.proteinAchievementPct}%</p>
                                <p className="text-[10px] text-slate-500">Goal: {result.details.goalProtein}g</p>
                            </div>
                            <div className="bg-slate-900/40 p-3 rounded-lg border border-white/5 space-y-1">
                                <p className="text-xs text-slate-400">Net Deficit</p>
                                <p className={cn(
                                    "text-lg font-bold",
                                    result.details.deficit > 0 ? "text-green-400" : "text-red-400"
                                )}>{result.details.deficit} kcal</p>
                                <p className="text-[10px] text-slate-500">TDEE: {result.details.tdee}</p>
                            </div>
                            <div className="bg-slate-900/40 p-3 rounded-lg border border-white/5 space-y-1">
                                <p className="text-xs text-slate-400">Status</p>
                                <p className="text-lg font-bold text-white">Log Saved</p>
                            </div>
                        </div>
                    )}

                    <Button
                        variant="outline"
                        onClick={() => setResult(null)}
                        className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                        Close & Log Another
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md mx-auto glass-panel border-white/10 shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Activity className="h-6 w-6 text-primary" />
                    Daily Trace
                </CardTitle>
                <CardDescription className="text-slate-400">
                    Log minimally. Verify trajectory.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-slate-300">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-slate-900/50 border-slate-700 text-white"
                            required
                        />
                    </div>

                    {/* Weight & Body Fat */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="weight" className="text-slate-300 flex items-center gap-1">
                                <Scale className="h-3.5 w-3.5" /> Weight (kg)
                            </Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                placeholder="e.g. 75.5"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="bg-slate-900/50 border-slate-700 text-white text-lg font-semibold"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bodyFat" className="text-slate-300 flex items-center gap-1">
                                <Percent className="h-3.5 w-3.5" /> Body Fat %
                            </Label>
                            <Input
                                id="bodyFat"
                                type="number"
                                step="0.1"
                                placeholder="e.g. 15.0"
                                value={bodyFat}
                                onChange={(e) => setBodyFat(e.target.value)}
                                className="bg-slate-900/50 border-slate-700 text-white"
                            />
                        </div>
                    </div>

                    {/* Calories & Protein */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="calories" className="text-slate-300 flex items-center gap-1">
                                <Utensils className="h-3.5 w-3.5" /> Intake (kcal)
                            </Label>
                            <Input
                                id="calories"
                                type="number"
                                placeholder="e.g. 2200"
                                value={calories}
                                onChange={(e) => setCalories(e.target.value)}
                                className="bg-slate-900/50 border-slate-700 text-white text-lg font-semibold"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="protein" className="text-slate-300 flex items-center gap-1">
                                <Dumbbell className="h-3.5 w-3.5" /> Protein (g)
                            </Label>
                            <Input
                                id="protein"
                                type="number"
                                placeholder="e.g. 180"
                                value={protein}
                                onChange={(e) => setProtein(e.target.value)}
                                className="bg-slate-900/50 border-slate-700 text-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Hydration & Burn */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="hydration" className="text-slate-300 flex items-center gap-1">
                                <Droplets className="h-3.5 w-3.5" /> Water (L)
                            </Label>
                            <Input
                                id="hydration"
                                type="number"
                                step="0.1"
                                placeholder="e.g. 3.0"
                                value={hydration}
                                onChange={(e) => setHydration(e.target.value)}
                                className="bg-slate-900/50 border-slate-700 text-white"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sportsBurn" className="text-slate-300 flex items-center gap-1">
                                <Flame className="h-3.5 w-3.5" /> Sport Burn
                            </Label>
                            <Input
                                id="sportsBurn"
                                type="number"
                                placeholder="e.g. 400"
                                value={sportsBurn}
                                onChange={(e) => setSportsBurn(e.target.value)}
                                className="bg-slate-900/50 border-slate-700 text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer transition-all",
                                training
                                    ? "bg-primary/20 border-primary text-primary"
                                    : "bg-slate-900/30 border-slate-800 text-slate-400 hover:bg-slate-900/50"
                            )}
                            onClick={() => setTraining(!training)}
                        >
                            <Dumbbell className="h-6 w-6 mb-2" />
                            <span className="text-xs font-medium">Training</span>
                            <span className="text-[10px] opacity-70">Performed?</span>
                        </div>

                        <div
                            className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer transition-all",
                                sleep
                                    ? "bg-indigo-500/20 border-indigo-500 text-indigo-400"
                                    : "bg-slate-900/30 border-slate-800 text-slate-400 hover:bg-slate-900/50"
                            )}
                            onClick={() => setSleep(!sleep)}
                        >
                            <Moon className="h-6 w-6 mb-2" />
                            <span className="text-xs font-medium">Sleep</span>
                            <span className="text-[10px] opacity-70">Adequate?</span>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-white text-black hover:bg-slate-200 font-bold"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Logging..." : "Log Daily Metrics"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
