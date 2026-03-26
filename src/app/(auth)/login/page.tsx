'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid username or password')
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo/Header */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🐔</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">பாலமுருகன் ட்ரேடர்ஸ்</h1>
          <p className="text-slate-500 mt-1">Balamurugan Traders</p>
          <p className="text-green-400/60 text-sm mt-1">Poultry Trading Daily Ledger</p>
        </div>

        <Card className="border-slate-700/50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Login / உள்நுழை</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">Username / பயனர்பெயர்</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password / கடவுச்சொல்</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? 'Logging in...' : 'Login / உள்நுழை'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
