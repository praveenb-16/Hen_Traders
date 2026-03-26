'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BalanceSection } from './BalanceSection'
import { formatCurrency, type DiffType } from '@/lib/calculations'

interface KattiKoliFormProps {
  onSubmit: (data: KattiFormData) => void
  lastRates?: { kRate?: number }
  initialOldAmount?: number
  initialOldType?: DiffType
  isFirstTransaction?: boolean
}

export interface KattiFormData {
  henType: 'KATTI_KOLI'
  kBox1: number
  kHen1: number
  kBox2: number
  kHen2: number
  kTotalHens: number
  kRate: number
  kAmount: number
  kLabour: number
  kTotal: number
  totalAmount: number
  paidAmount: number
  todayType: DiffType
  todayAmount: number
  oldAmount: number
  oldType: DiffType
  finalType: DiffType
  finalAmount: number
}

export function KattiKoliForm({ onSubmit, lastRates, initialOldAmount = 0, initialOldType = 'BALANCE', isFirstTransaction = false }: KattiKoliFormProps) {
  const [kBox1, setKBox1] = useState(0)
  const [kHen1, setKHen1] = useState(0)
  const [kBox2, setKBox2] = useState(0)
  const [kHen2, setKHen2] = useState(0)
  const [kRate, setKRate] = useState(lastRates?.kRate || 45)
  const [kLabour, setKLabour] = useState(1600)
  const [paidAmount, setPaidAmount] = useState(0)
  const [oldAmount, setOldAmount] = useState(initialOldAmount)
  const [oldType, setOldType] = useState<DiffType>(initialOldType)
  const [finalType, setFinalType] = useState<DiffType>('BALANCE')
  const [finalAmount, setFinalAmount] = useState(0)

  const kTotalHens = kBox1 * kHen1 + kBox2 * kHen2
  const kAmount = kTotalHens * kRate
  const kTotal = kAmount + kLabour

  useEffect(() => {
    setOldAmount(initialOldAmount)
    setOldType(initialOldType || 'BALANCE')
  }, [initialOldAmount, initialOldType])

  useEffect(() => {
    if (lastRates?.kRate) {
      setKRate(lastRates.kRate)
    }
  }, [lastRates?.kRate])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const submitData: KattiFormData = {
      henType: 'KATTI_KOLI',
      kBox1,
      kHen1,
      kBox2,
      kHen2,
      kTotalHens,
      kRate,
      kAmount,
      kLabour,
      kTotal,
      totalAmount: kTotal,
      paidAmount,
      todayType: paidAmount > kTotal ? 'EXTRA' : 'BALANCE',
      todayAmount: Math.abs(kTotal - paidAmount),
      oldAmount,
      oldType,
      finalType,
      finalAmount,
    }
    onSubmit(submitData)
  }, [kBox1, kHen1, kBox2, kHen2, kRate, kLabour, paidAmount, oldAmount, oldType, finalType, finalAmount])

  const handleFinalChange = (type: DiffType, amount: number) => {
    setFinalType(type)
    setFinalAmount(amount)
  }

  return (
    <div className="space-y-5">
      <Card className="border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-center text-orange-300">
            கட்டி கோழி / Katti Koli
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Row 1 / வரிசை 1 <span className="text-slate-500">(Box × Hen)</span>
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={kBox1 || ''}
                  onChange={(e) => setKBox1(Number(e.target.value) || 0)}
                  placeholder="Box"
                  className="flex-1"
                />
                <span className="text-slate-500">×</span>
                <Input
                  type="number"
                  value={kHen1 || ''}
                  onChange={(e) => setKHen1(Number(e.target.value) || 0)}
                  placeholder="Hen"
                  className="flex-1"
                />
                <span className="flex items-center text-slate-200 font-semibold min-w-[60px]">
                  = {kBox1 * kHen1}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                Row 2 / வரிசை 2 <span className="text-slate-500">(Box × Hen)</span>
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={kBox2 || ''}
                  onChange={(e) => setKBox2(Number(e.target.value) || 0)}
                  placeholder="Box"
                  className="flex-1"
                />
                <span className="text-slate-500">×</span>
                <Input
                  type="number"
                  value={kHen2 || ''}
                  onChange={(e) => setKHen2(Number(e.target.value) || 0)}
                  placeholder="Hen"
                  className="flex-1"
                />
                <span className="flex items-center text-slate-200 font-semibold min-w-[60px]">
                  = {kBox2 * kHen2}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <Label className="text-base font-semibold text-slate-200">
              Total Hens / மொத்த கோழிகள்
            </Label>
            <span className="text-xl font-bold text-orange-400 font-mono">{kTotalHens}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Rate / விலை (₹)</Label>
              <Input
                type="number"
                value={kRate || ''}
                onChange={(e) => setKRate(Number(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Amount / தொகை (₹)</Label>
              <div className="h-11 flex items-center text-slate-200 font-semibold font-mono">
                {formatCurrency(kAmount)}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Labour / தொழிலாளர் (₹)</Label>
              <Input
                type="number"
                value={kLabour || ''}
                onChange={(e) => setKLabour(Number(e.target.value) || 0)}
                placeholder="1600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
            <Label className="text-base font-semibold text-slate-100">
              Total / மொத்தம்
            </Label>
            <span className="text-xl font-bold text-green-400 font-mono">
              {formatCurrency(kTotal)}
            </span>
          </div>
        </CardContent>
      </Card>

      <BalanceSection
        totalAmount={kTotal}
        oldAmount={oldAmount}
        oldType={oldType}
        onOldAmountChange={setOldAmount}
        onOldTypeChange={setOldType}
        onPaidAmountChange={setPaidAmount}
        onFinalChange={handleFinalChange}
        isFirstTransaction={isFirstTransaction}
      />

      <div className="p-4 rounded-lg bg-green-900/20 border border-green-500/30">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold text-green-300">
            {finalType === 'BALANCE' ? 'Final Balance / இறுதி நிலுவை' : 'Final Extra / இறுதி அதிகம்'}
          </Label>
          <span className={`text-2xl font-bold font-mono ${finalType === 'BALANCE' ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(finalAmount)}
          </span>
        </div>
      </div>
    </div>
  )
}
