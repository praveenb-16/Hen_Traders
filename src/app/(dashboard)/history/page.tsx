'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BillDialog } from '@/components/forms/BillDialog'
import { formatCurrency, type DiffType } from '@/lib/calculations'

interface Transaction {
  id: string
  date: string
  henType: 'KATTI_KOLI' | 'NALLA_KOLI' | 'BOTH'
  kBox1: number | null
  kHen1: number | null
  kBox2: number | null
  kHen2: number | null
  kTotalHens: number | null
  kRate: number | null
  kAmount: number | null
  kLabour: number | null
  kTotal: number | null
  nBox1: number | null
  nHen1: number | null
  nBox2: number | null
  nHen2: number | null
  nTotalHens: number | null
  nNetWeight: number | null
  nWaterWeight: number | null
  nWeight: number | null
  nRate: number | null
  nAmount: number | null
  nLabour: number | null
  totalAmount: number
  paidAmount: number
  todayType: DiffType
  todayAmount: number
  oldAmount: number
  oldType: DiffType
  finalType: DiffType
  finalAmount: number
}

const henTypeLabels: Record<string, string> = {
  KATTI_KOLI: 'கட்டி கோழி / Katti Koli',
  NALLA_KOLI: 'நல்ல கோழி / Nalla Koli',
  BOTH: 'இரண்டு வகை / Both Types',
}

export default function HistoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [billTransaction, setBillTransaction] = useState<Transaction | null>(null)
  const success = searchParams.get('success')

  useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getHenTypeLabel = (type: string) => henTypeLabels[type] || type

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          Transaction History / பரிவராச்சனம் வரலாறு
        </h2>
        <Button onClick={() => router.push('/')}>
          New Transaction / புதிய பரிவராச்சனம்
        </Button>
      </div>

      {success && (
        <div className="p-3 bg-green-100 text-green-800 rounded-md">
          Transaction saved successfully! / பரிவராச்சனம் வெற்றியாக சேமிக்கப்பட்டது!
        </div>
      )}

      {loading ? (
        <div className="text-center p-8">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-slate-600">No transactions yet.</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Create First Transaction
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <Card 
              key={tx.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {format(new Date(tx.date), 'dd/MM/yy')}
                    </CardTitle>
                    <p className="text-sm text-slate-500 font-medium">
                      {getHenTypeLabel(tx.henType)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      tx.finalType === 'BALANCE' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(tx.finalAmount)}
                    </p>
                    <p className="text-sm text-slate-500">
                      {tx.finalType === 'BALANCE' ? 'Balance' : 'Extra'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Total / மொத்தம்</p>
                    <p className="font-medium">{formatCurrency(tx.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Paid / செலுத்திய</p>
                    <p className="font-medium">{formatCurrency(tx.paidAmount)}</p>
                  </div>
                  {tx.henType === 'KATTI_KOLI' && (
                    <div>
                      <p className="text-slate-500">Hens / கோழிகள்</p>
                      <p className="font-medium">{tx.kTotalHens || 0}</p>
                    </div>
                  )}
                  {tx.henType === 'NALLA_KOLI' && (
                    <>
                      <div>
                        <p className="text-slate-500">Hens / கோழிகள்</p>
                        <p className="font-medium">{tx.nTotalHens || 0}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Weight / எடை</p>
                        <p className="font-medium">{tx.nWeight || 0} Kg</p>
                      </div>
                    </>
                  )}
                </div>

                {expandedId === tx.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setBillTransaction(tx)
                        }}
                      >
                        Generate Bill / பில் உருவாக்கு
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {tx.kTotalHens && (
                        <div className="p-3 bg-slate-50 rounded-md">
                          <p className="font-semibold">கட்டி கோழி / Katti Koli</p>
                          <p>Hens: {tx.kTotalHens}</p>
                          <p>Amount: {formatCurrency(tx.kAmount || 0)}</p>
                          <p>Total: {formatCurrency(tx.kTotal || 0)}</p>
                        </div>
                      )}
                      {tx.nTotalHens && (
                        <div className="p-3 bg-slate-50 rounded-md">
                          <p className="font-semibold">நல்ல கோழி / Nalla Koli</p>
                          <p>Hens: {tx.nTotalHens}</p>
                          <p>Weight: {tx.nWeight} Kg</p>
                          <p>Amount: {formatCurrency(tx.nAmount || 0)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {billTransaction && (
        <BillDialog 
          transaction={billTransaction} 
          open={!!billTransaction} 
          onClose={() => setBillTransaction(null)} 
        />
      )}
    </div>
  )
}