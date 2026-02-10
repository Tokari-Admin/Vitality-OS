import Link from "next/link"
import { ArrowRight, Activity, Target, Zap, Shield, ChevronRight, BarChart3, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export default async function LandingPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-indigo-400" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">CUTOS</span>
                    </div>
                    <div className="flex items-center gap-6">
                        {user ? (
                            <Link href="/dashboard">
                                <Button className="bg-white text-black hover:bg-slate-200 rounded-full px-6">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/login">
                                    <Button className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-full px-6">
                                        Join the Elite
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase mb-8">
                        <Zap className="h-3 w-3" />
                        Next-Gen Metabolic OS
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                        Stop Guessing. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
                            Start Steering.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        CUTOS is the high-precision metabolic flight controller designed for elite body composition.
                        Algorithms, not guesswork. Results, not hope.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/login">
                            <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-full px-10 h-14 text-lg font-semibold group">
                                Initiate Protocol
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button size="lg" variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-900 rounded-full px-8 h-14 text-lg">
                                View Capabilities
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats/Social Proof (Optional placeholder) */}
            <section className="border-y border-slate-800/50 bg-slate-900/20 py-12">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1 font-mono">98%</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Goal Completion</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1 font-mono">Real-Time</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">TDEE Tracking</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1 font-mono">0</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Guesswork</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white mb-1 font-mono">24/7</div>
                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">System Monitoring</div>
                    </div>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="py-24 px-6" id="features">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="text-indigo-400 font-bold text-sm uppercase tracking-widest mb-4">The Metabolic Gap</div>
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Traditional tracking is broken. <br />
                                <span className="text-slate-500">Passive apps just watch you fail.</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                                Most apps are glorified spreadsheets. They don't account for metabolic adaptation, sports burn fluctuation, or daily adherence quality.
                                <br /><br />
                                CUTOS changes that. It acts as an active steering system that recalibrates your path every single day based on your real biological response.
                            </p>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="h-6 w-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-1">
                                        <div className="h-2 w-2 rounded-full bg-red-500" />
                                    </div>
                                    <p className="text-slate-300">Stop falling into "metabolic plateaus" that blindside you.</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-6 w-6 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-1">
                                        <div className="h-2 w-2 rounded-full bg-red-500" />
                                    </div>
                                    <p className="text-slate-300">End the cycle of guessing your maintenance calories.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/30 transition-colors group">
                                <BarChart3 className="h-10 w-10 text-indigo-400 mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold text-white mb-3">Live TDEE</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Dynamic expenditure calculation that adapts to your NEAT, TEF, and Sports burn in real-time.
                                </p>
                            </div>
                            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-blue-400/30 transition-colors group">
                                <Target className="h-10 w-10 text-blue-400 mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold text-white mb-3">Execution Score</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    A daily mathematical grade of your discipline. Gamify your adherence to the protocol.
                                </p>
                            </div>
                            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-emerald-400/30 transition-colors group">
                                <TrendingDown className="h-10 w-10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold text-white mb-3">Net Deficit</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Real-time visibility into the actual fat loss pressure you are applying to your system.
                                </p>
                            </div>
                            <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-amber-400/30 transition-colors group">
                                <Shield className="h-10 w-10 text-amber-400 mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold text-white mb-3">Elite Privacy</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Your biological data is yours. Secure, encrypted, and accessible only by you.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 px-6 border-t border-slate-800/50">
                <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-b from-indigo-600 to-indigo-700 p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/20">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                            Ready to take command?
                        </h2>
                        <p className="text-indigo-100 text-lg md:text-xl mb-12 max-w-xl mx-auto opacity-90">
                            Join the ranks of high-performers who have traded "wishful thinking" for "metabolic steering."
                        </p>
                        <Link href="/login">
                            <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 rounded-full px-12 h-16 text-xl font-bold shadow-xl">
                                Initiate My Protocol
                            </Button>
                        </Link>
                        <p className="text-indigo-200 mt-6 text-sm flex items-center justify-center gap-2">
                            <Shield className="h-4 w-4" />
                            No credit card required to start.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800/50 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-indigo-500" />
                    <span className="font-bold text-white tracking-tight">CUTOS</span>
                </div>
                <p className="text-slate-500 text-sm">
                    © 2026 Metabolic Steering Systems. Built for High Performance.
                </p>
            </footer>
        </div>
    )
}
