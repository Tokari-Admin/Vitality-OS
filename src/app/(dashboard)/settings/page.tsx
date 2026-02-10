import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SettingsForm } from "@/components/settings-form"

export default async function SettingsPage() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    // Fetch Active Protocol
    const { data: protocol } = await supabase
        .from("protocols")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "ACTIVE")
        .single()

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Goals & Settings</h1>
                <p className="text-slate-400">Manage your metabolic targets.</p>
            </div>

            <div className="grid gap-6">
                <SettingsForm initialData={protocol} />
            </div>
        </div>
    )
}
