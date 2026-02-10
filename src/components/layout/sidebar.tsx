"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Settings,
    TrendingUp,
    History,
    User,
    LogOut,
    Target
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard
    },
    {
        title: "Trajectory",
        href: "/trajectory",
        icon: TrendingUp
    },
    {
        title: "History",
        href: "/history",
        icon: History
    },
    {
        title: "Goals & Settings",
        href: "/settings",
        icon: Settings
    }
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col h-full w-full bg-slate-950 border-r border-slate-800">
            {/* Header / Logo */}
            <div className="p-6">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                        <Target className="h-4 w-4 text-indigo-400" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">CUTOS</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 ml-10">Metabolic System</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 py-4">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.05)]"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80"
                            )}
                        >
                            <item.icon className={cn(
                                "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                                isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                            )} />
                            {item.title}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer / User Profile */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">User</p>
                        <p className="text-xs text-slate-500 truncate">Settings</p>
                    </div>

                    <form action="/auth/signout" method="post">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
