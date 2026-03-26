'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/calculations'
import type { DiffType } from '@/lib/calculations'
import { ChevronRight, Plus, History, Wallet } from 'lucide-react'

interface LatestTransaction {
  finalType: DiffType
  finalAmount: number
}

export default function HomePage() {
  const router = useRouter()
  const [step, setStep] = useState<'initial' | 'single'>('initial')
  const [latestTx, setLatestTx] = useState<LatestTransaction | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/transactions/latest')
      .then(res => res.json())
      .then(data => {
        if (data.hasPrevious && data.finalAmount !== undefined) {
          setLatestTx({
            finalType: data.finalType,
            finalAmount: data.finalAmount
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-slate-100">
          பாலமுருகன் ட்ரேடர்ஸ்
        </h1>
        <p className="text-slate-400 mt-1">Balamurugan Traders</p>
        <p className="text-green-400 text-sm mt-1">Poultry Trading Daily Ledger</p>
      </div>

      {/* Previous Balance Card */}
      {!loading && latestTx && (
        <Card 
          className="cursor-pointer card-hover border-green-500/30 bg-gradient-to-r from-slate-900 to-slate-800/50"
          onClick={() => router.push('/history')}
        >
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Wallet className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg text-green-400">
                    Previous Balance
                  </CardTitle>
                  <p className="text-slate-400 text-sm mt-0.5">
                    முந்தைய நிலுவை
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold font-mono ${
                  latestTx.finalType === 'BALANCE' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatCurrency(latestTx.finalAmount)}
                </p>
                <p className="text-sm text-slate-500">
                  {latestTx.finalType === 'BALANCE' ? 'Balance / நிலுவை' : 'Extra / அதிகம்'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center text-sm text-slate-500">
              <span>View full history</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !latestTx && (
        <Card className="border-dashed border-slate-600 bg-slate-900/50">
          <CardHeader className="py-6 text-center">
            <div className="p-3 rounded-full bg-slate-800 w-fit mx-auto mb-3">
              <Plus className="w-6 h-6 text-slate-400" />
            </div>
            <CardTitle className="text-xl text-slate-200">
              No Previous Records
            </CardTitle>
            <p className="text-slate-500 mt-1">
              முன்பு பதிவுகள் இல்லை - Create your first transaction
            </p>
          </CardHeader>
        </Card>
      )}

      {/* Select Hen Type */}
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-200">
          கோழி வகை தேர்வு
        </h2>
        <p className="text-slate-500 text-sm">Select Hen Type</p>
      </div>

      {step === 'initial' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer card-hover border-slate-600/50"
            onClick={() => setStep('single')}
          >
            <CardHeader className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-400">1</span>
              </div>
              <CardTitle className="text-xl">ஒரே வகை</CardTitle>
              <p className="text-slate-400 mt-1 font-medium">Single Type</p>
            </CardHeader>
            <CardContent className="text-center text-slate-500 pb-6">
              Either Katti Koli or Nalla Koli
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer card-hover border-slate-600/50"
            onClick={() => router.push('/new?type=BOTH')}
          >
            <CardHeader className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-blue-400">2</span>
              </div>
              <CardTitle className="text-xl">இரண்டு வகை</CardTitle>
              <p className="text-slate-400 mt-1 font-medium">Both Types</p>
            </CardHeader>
            <CardContent className="text-center text-slate-500 pb-6">
              Both Katti Koli and Nalla Koli together
            </CardContent>
          </Card>
        </div>
      )}

      {step === 'single' && (
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => setStep('initial')}
            className="mb-2"
          >
            ← Back / திரும்பு
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className="cursor-pointer card-hover border-slate-600/50"
              onClick={() => router.push('/new?type=KATTI_KOLI')}
            >
              <CardHeader className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🐔</span>
                </div>
                <CardTitle className="text-xl text-orange-300">கட்டி கோழி</CardTitle>
                <p className="text-slate-400 mt-1 font-medium">Katti Koli</p>
              </CardHeader>
              <CardContent className="text-center text-slate-500 pb-6">
                Weight-based calculation / Count × Rate
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer card-hover border-slate-600/50"
              onClick={() => router.push('/new?type=NALLA_KOLI')}
            >
              <CardHeader className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🐣</span>
                </div>
                <CardTitle className="text-xl text-yellow-300">நல்ல கோழி</CardTitle>
                <p className="text-slate-400 mt-1 font-medium">Nalla Koli</p>
              </CardHeader>
              <CardContent className="text-center text-slate-500 pb-6">
                Weight-based calculation / Net Weight × Rate
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-3 pt-2">
        <Button 
          variant="secondary" 
          className="flex-1"
          onClick={() => router.push('/history')}
        >
          <History className="w-4 h-4 mr-2" />
          History / வரலாறு
        </Button>
      </div>
    </div>
  )
}
