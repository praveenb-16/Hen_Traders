'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { KattiKoliForm, type KattiFormData } from '@/components/forms/KattiKoliForm'
import { NallaKoliForm, type NallaFormData } from '@/components/forms/NallaKoliForm'
import { BothForm, type BothFormData } from '@/components/forms/BothForm'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import type { DiffType } from '@/lib/calculations'

type FormData = KattiFormData | NallaFormData | BothFormData

interface LatestData {
  hasPrevious: boolean
  finalAmount?: number
  finalType?: DiffType
  kRate?: number
  nRate?: number
}

export default function NewTransactionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const type = searchParams.get('type') as 'KATTI_KOLI' | 'NALLA_KOLI' | 'BOTH'
  
  const [formData, setFormData] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(false)
  const [latestData, setLatestData] = useState<LatestData>({ hasPrevious: false, kRate: 45, nRate: 68 })

  useEffect(() => {
    fetch('/api/transactions/latest')
      .then(res => res.json())
      .then(data => setLatestData(data))
      .catch(() => setLatestData({ hasPrevious: false, kRate: 45, nRate: 68 }))
  }, [])

  const handleSubmit = async () => {
    if (!formData) return
    setLoading(true)

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/history?success=true')
      } else {
        alert('Failed to save transaction')
      }
    } catch (error) {
      console.error('Error saving transaction:', error)
      alert('Failed to save transaction')
    } finally {
      setLoading(false)
    }
  }

  const getHenTypeLabel = () => {
    switch (type) {
      case 'KATTI_KOLI':
        return 'கட்டி கோழி / Katti Koli'
      case 'NALLA_KOLI':
        return 'நல்ல கோழி / Nalla Koli'
      case 'BOTH':
        return 'இரண்டு வகை / Both Types'
      default:
        return ''
    }
  }

  if (!type) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-slate-600">Please select a hen type from the home page.</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          Go Home / முகப்பு
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">பாலமுருகன் ட்ரேடர்ஸ் / Balamurugan Traders</CardTitle>
          <p className="text-lg font-medium mt-2">
            {getHenTypeLabel()}
          </p>
          <p className="text-slate-600">
            Date / தேதி: {format(new Date(), 'dd/MM/yy')}
          </p>
        </CardHeader>
      </Card>

      {type === 'KATTI_KOLI' && (
        <KattiKoliForm
          onSubmit={setFormData}
          lastRates={{ kRate: latestData.kRate }}
          initialOldAmount={latestData.hasPrevious ? latestData.finalAmount : 0}
          initialOldType={latestData.hasPrevious ? latestData.finalType : 'BALANCE'}
          isFirstTransaction={!latestData.hasPrevious}
        />
      )}

      {type === 'NALLA_KOLI' && (
        <NallaKoliForm
          onSubmit={setFormData}
          lastRates={{ nRate: latestData.nRate }}
          initialOldAmount={latestData.hasPrevious ? latestData.finalAmount : 0}
          initialOldType={latestData.hasPrevious ? latestData.finalType : 'BALANCE'}
          isFirstTransaction={!latestData.hasPrevious}
        />
      )}

      {type === 'BOTH' && (
        <BothForm
          onSubmit={setFormData}
          lastRates={{ kRate: latestData.kRate, nRate: latestData.nRate }}
          initialOldAmount={latestData.hasPrevious ? latestData.finalAmount : 0}
          initialOldType={latestData.hasPrevious ? latestData.finalType : 'BALANCE'}
          isFirstTransaction={!latestData.hasPrevious}
        />
      )}

      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="flex-1"
        >
          Cancel / ரத்து
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !formData}
          className="flex-1"
        >
          {loading ? 'Saving...' : 'Save / சேமி'}
        </Button>
      </div>
    </div>
  )
}