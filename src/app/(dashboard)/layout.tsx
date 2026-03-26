import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Home, History, LogOut } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Floating Navbar */}
      <header className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-2xl mx-auto">
          <nav className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-lg px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <span className="text-lg">🐔</span>
                </div>
                <div>
                  <h1 className="text-sm font-bold text-slate-100">பாலமுருகன்</h1>
                  <p className="text-xs text-slate-500">Traders</p>
                </div>
              </Link>
              <div className="flex items-center gap-1">
                <Link href="/">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-100">
                    <Home className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/history">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-100">
                    <History className="w-4 h-4" />
                  </Button>
                </Link>
                <form
                  action={async () => {
                    'use server'
                    await signOut()
                  }}
                >
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-400" type="submit">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          </nav>
        </div>
      </header>
      
      {/* Main Content with top padding for fixed navbar */}
      <main className="max-w-2xl mx-auto p-4 pt-24">
        {children}
      </main>
    </div>
  )
}
