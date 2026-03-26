import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white p-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">பாலமுருகன் ட்ரேடர்ஸ் / Balamurugan Traders</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm hover:underline">
              Home / முகப்பு
            </Link>
            <form
              action={async () => {
                'use server'
                await signOut()
              }}
            >
              <Button variant="secondary" size="sm" type="submit">
                Logout / வெளியேறு
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4">{children}</main>
    </div>
  )
}