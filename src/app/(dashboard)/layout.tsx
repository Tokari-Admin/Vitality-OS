import { Sidebar } from "@/components/layout/sidebar"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="flex h-screen w-full bg-slate-950 overflow-hidden">
            <aside className="hidden lg:block w-64 border-r border-slate-800 bg-slate-950">
                <main className="h-full flex flex-col">
                    {/* Move actual Sidebar here or just make it component driven */}
                    {/* The Sidebar component manages its own layout so we can just use it directly */}
                    <div className="flex-1 flex flex-col h-full">
                        {/* We have to make sure Sidebar is purely list items or structure */}
                        <Sidebar />
                    </div>
                </main>
            </aside>
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
