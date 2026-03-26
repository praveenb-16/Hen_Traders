'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/calculations'
import type { DiffType } from '@/lib/calculations'

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
    <div className="space-y-6">
      {/* History Section - Separate - Blue Color */}
      {!loading && latestTx && (
        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-blue-500 bg-blue-50"
          onClick={() => router.push('/history')}
        >
          <CardHeader className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-blue-800">
                  Previous Balance / முந்தைய நிலுவை
                </CardTitle>
                <p className="text-blue-600 mt-1">
                  {latestTx.finalType === 'BALANCE' ? 'Balance / நிலுவை' : 'Extra / அதிகம்'}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${latestTx.finalType === 'BALANCE' ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(latestTx.finalAmount)}
                </p>
                <p className="text-sm text-blue-500">
                  Click to view history / வரலாறு பார்க்க click
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {!loading && !latestTx && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader className="py-4 text-center">
            <CardTitle className="text-xl text-blue-800">
              No Previous Records / முன்பு பதிவுகள் இல்லை
            </CardTitle>
            <p className="text-blue-600 mt-1">
              Create your first transaction / உங்கள் முதல் பரிவராச்சனத்தை உருவாக்குங்கள்
            </p>
          </CardHeader>
        </Card>
      )}

      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          கோழி வகை தேர்வு / Select Hen Type
        </h2>
      </div>

      {step === 'initial' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-slate-200 hover:border-slate-400"
            onClick={() => setStep('single')}
          >
            <CardHeader className="text-center py-8">
              <CardTitle className="text-3xl">1</CardTitle>
              <p className="text-lg font-medium mt-2">ஒரே வகை / Single Type</p>
            </CardHeader>
            <CardContent className="text-center text-slate-600 pb-8">
              Either Katti Koli or Nalla Koli
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-slate-200 hover:border-slate-400"
            onClick={() => router.push('/new?type=BOTH')}
          >
            <CardHeader className="text-center py-8">
              <CardTitle className="text-3xl">2</CardTitle>
              <p className="text-lg font-medium mt-2">இரண்டு வகை / Both Types</p>
            </CardHeader>
            <CardContent className="text-center text-slate-600 pb-8">
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
            className="mb-4"
          >
            ← Back / திரும்பு
          </Button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-slate-200 hover:border-slate-400"
              onClick={() => router.push('/new?type=KATTI_KOLI')}
            >
              <CardHeader className="text-center py-8">
                <CardTitle className="text-2xl">கட்டி கோழி</CardTitle>
                <p className="text-lg font-medium mt-2">Katti Koli</p>
              </CardHeader>
              <CardContent className="text-center text-slate-600 pb-8">
                Weight-based calculation
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-slate-200 hover:border-slate-400"
              onClick={() => router.push('/new?type=NALLA_KOLI')}
            >
              <CardHeader className="text-center py-8">
                <CardTitle className="text-2xl">நல்ல கோழி</CardTitle>
                <p className="text-lg font-medium mt-2">Nalla Koli</p>
              </CardHeader>
              <CardContent className="text-center text-slate-600 pb-8">
                Weight-based calculation
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}