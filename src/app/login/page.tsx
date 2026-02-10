'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Activity } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setMessage(error.message)
            setLoading(false)
        } else {
            router.push('/dashboard')
            router.refresh()
        }
    }

    const handleSignUp = async () => {
        setLoading(true)
        setMessage(null)
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            setMessage(error.message)
        } else {
            setMessage('Check your email for the confirmation link.')
        }
        setLoading(false)
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
            <Card className="w-full max-w-md bg-slate-900/40 border-slate-800 text-white">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-indigo-400" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">CUTOS</span>
                    </div>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Sign in to your metabolic system</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m.k@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-slate-950/50 border-slate-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-slate-950/50 border-slate-800"
                            />
                        </div>
                        {message && (
                            <div className="text-sm p-3 rounded-md bg-red-500/10 text-red-500 border border-red-500/20">
                                {message}
                            </div>
                        )}
                        <div className="flex flex-col gap-3 pt-2">
                            <Button type="submit" disabled={loading} className="w-full bg-white text-black hover:bg-slate-200">
                                {loading ? 'Processing...' : 'Sign In'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-slate-800 pt-6">
                    <p className="text-sm text-slate-500">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={handleSignUp}
                            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                            disabled={loading}
                        >
                            Sign Up
                        </button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
