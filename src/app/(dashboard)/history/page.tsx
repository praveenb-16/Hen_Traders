'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BillDialog } from '@/components/forms/BillDialog'
import { formatCurrency } from '@/lib/calculations'
import type { TransactionData } from '@/lib/types'
import { ChevronDown, ChevronUp, Receipt, Plus } from 'lucide-react'

const henTypeLabels: Record<string, string> = {
  KATTI_KOLI: 'கட்டி கோழி / Katti Koli',
  NALLA_KOLI: 'நல்ல கோழி / Nalla Koli',
  BOTH: 'இரண்டு வகை / Both Types',
}

const henTypeColors: Record<string, string> = {
  KATTI_KOLI: 'text-orange-300',
  NALLA_KOLI: 'text-yellow-300',
  BOTH: 'text-green-300',
}

export default function HistoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [billTransaction, setBillTransaction] = useState<TransactionData | null>(null)
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
  const getHenTypeColor = (type: string) => henTypeColors[type] || 'text-slate-300'

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">
            Transaction History
          </h2>
          <p className="text-slate-500 text-sm">பரிவராச்சனம் வரலாறு</p>
        </div>
        <Button onClick={() => router.push('/')} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          New Transaction
        </Button>
      </div>

      {success && (
        <div className="p-3 bg-green-900/30 border border-green-500/30 text-green-400 rounded-lg flex items-center">
          <span>Transaction saved successfully! / பரிவராச்சனம் வெற்றியாக சேமிக்கப்பட்டது!</span>
        </div>
      )}

      {loading ? (
        <div className="text-center p-8 text-slate-500">Loading...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-slate-500">No transactions yet.</p>
          <Button onClick={() => router.push('/')} className="mt-4 bg-green-600 hover:bg-green-700">
            Create First Transaction
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <Card 
              key={tx.id} 
              className={`cursor-pointer card-hover border-slate-700/50 ${expandedId === tx.id ? 'border-slate-500' : ''}`}
              onClick={() => setExpandedId(expandedId === tx.id ? null : tx.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-slate-100">
                      {format(new Date(tx.date), 'dd/MM/yy')}
                    </CardTitle>
                    <p className={`text-sm font-medium ${getHenTypeColor(tx.henType)}`}>
                      {getHenTypeLabel(tx.henType)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold font-mono ${
                      tx.finalType === 'BALANCE' ? 'text-green-400' : 'text-red-400'
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="p-2 bg-slate-800/50 rounded-lg">
                    <p className="text-slate-500 text-xs">Total / மொத்தம்</p>
                    <p className="font-semibold text-slate-200 font-mono">{formatCurrency(tx.totalAmount)}</p>
                  </div>
                  <div className="p-2 bg-slate-800/50 rounded-lg">
                    <p className="text-slate-500 text-xs">Paid / செலுத்திய</p>
                    <p className="font-semibold text-slate-200 font-mono">{formatCurrency(tx.paidAmount)}</p>
                  </div>
                  {tx.henType === 'KATTI_KOLI' && (
                    <div className="p-2 bg-slate-800/50 rounded-lg">
                      <p className="text-slate-500 text-xs">Hens / கோழிகள்</p>
                      <p className="font-semibold text-orange-400 font-mono">{tx.kTotalHens || 0}</p>
                    </div>
                  )}
                  {tx.henType === 'NALLA_KOLI' && (
                    <>
                      <div className="p-2 bg-slate-800/50 rounded-lg">
                        <p className="text-slate-500 text-xs">Hens / கோழிகள்</p>
                        <p className="font-semibold text-yellow-400 font-mono">{tx.nTotalHens || 0}</p>
                      </div>
                      <div className="p-2 bg-slate-800/50 rounded-lg">
                        <p className="text-slate-500 text-xs">Weight / எடை</p>
                        <p className="font-semibold text-slate-200 font-mono">{tx.nWeight || 0} Kg</p>
                      </div>
                    </>
                  )}
                  {tx.henType === 'BOTH' && (
                    <div className="p-2 bg-slate-800/50 rounded-lg">
                      <p className="text-slate-500 text-xs">Both / இரண்டு</p>
                      <p className="font-semibold text-green-400 font-mono">✓</p>
                    </div>
                  )}
                </div>

                {expandedId === tx.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          setBillTransaction(tx)
                        }}
                        className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                      >
                        <Receipt className="w-4 h-4 mr-2" />
                        Generate Bill / பில் உருவாக்கு
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tx.kTotalHens && tx.kTotalHens > 0 && (
                        <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <p className="font-semibold text-orange-300 text-sm">கட்டி கோழி / Katti Koli</p>
                          <div className="mt-2 space-y-1 text-sm">
                            <p className="flex justify-between">
                              <span className="text-slate-500">Hens:</span>
                              <span className="text-slate-200 font-mono">{tx.kTotalHens}</span>
                            </p>
                            {tx.kFreeHen && tx.kFreeHen > 0 && (
                              <p className="flex justify-between">
                                <span className="text-purple-400">Free Hens:</span>
                                <span className="text-purple-400 font-mono">{tx.kFreeHen}</span>
                              </p>
                            )}
                            <p className="flex justify-between">
                              <span className="text-slate-500">Rate:</span>
                              <span className="text-slate-200 font-mono">₹{tx.kRate}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-slate-500">Amount:</span>
                              <span className="text-slate-200 font-mono">{formatCurrency(tx.kAmount || 0)}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-slate-500">Total:</span>
                              <span className="text-orange-400 font-mono font-semibold">{formatCurrency(tx.kTotal || 0)}</span>
                            </p>
                          </div>
                        </div>
                      )}
                      {tx.nTotalHens && tx.nTotalHens > 0 && (
                        <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                          <p className="font-semibold text-yellow-300 text-sm">நல்ல கோழி / Nalla Koli</p>
                          <div className="mt-2 space-y-1 text-sm">
                            <p className="flex justify-between">
                              <span className="text-slate-500">Hens:</span>
                              <span className="text-slate-200 font-mono">{tx.nTotalHens}</span>
                            </p>
                            {tx.nFreeHen && tx.nFreeHen > 0 && (
                              <p className="flex justify-between">
                                <span className="text-purple-400">Free Hens:</span>
                                <span className="text-purple-400 font-mono">{tx.nFreeHen}</span>
                              </p>
                            )}
                            <p className="flex justify-between">
                              <span className="text-slate-500">Weight:</span>
                              <span className="text-slate-200 font-mono">{tx.nWeight} Kg</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-slate-500">Rate:</span>
                              <span className="text-slate-200 font-mono">₹{tx.nRate}</span>
                            </p>
                            <p className="flex justify-between">
                              <span className="text-slate-500">Amount:</span>
                              <span className="text-yellow-400 font-mono font-semibold">{formatCurrency(tx.nAmount || 0)}</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {expandedId !== tx.id && (
                  <div className="mt-3 flex items-center text-xs text-slate-500">
                    <span>Tap to expand</span>
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </div>
                )}
                {expandedId === tx.id && (
                  <div className="mt-3 flex items-center text-xs text-slate-500">
                    <span>Tap to collapse</span>
                    <ChevronUp className="w-3 h-3 ml-1" />
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
