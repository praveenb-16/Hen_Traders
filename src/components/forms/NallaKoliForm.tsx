'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BalanceSection } from './BalanceSection'
import { formatCurrency, type DiffType } from '@/lib/calculations'

interface NallaKoliFormProps {
  onSubmit: (data: NallaFormData) => void
  lastRates?: { nRate?: number }
  initialOldAmount?: number
  initialOldType?: DiffType
  isFirstTransaction?: boolean
}

export interface NallaFormData {
  henType: 'NALLA_KOLI'
  nBox1: number
  nHen1: number
  nBox2: number
  nHen2: number
  nTotalHens: number
  nNetWeight: number
  nWaterWeight: number
  nWeight: number
  nRate: number
  nAmount: number
  nLabour: number
  totalAmount: number
  paidAmount: number
  todayType: DiffType
  todayAmount: number
  oldAmount: number
  oldType: DiffType
  finalType: DiffType
  finalAmount: number
}

export function NallaKoliForm({ onSubmit, lastRates, initialOldAmount = 0, initialOldType = 'BALANCE', isFirstTransaction = false }: NallaKoliFormProps) {
  const [nBox1, setNBox1] = useState(0)
  const [nHen1, setNHen1] = useState(0)
  const [nBox2, setNBox2] = useState(0)
  const [nHen2, setNHen2] = useState(0)
  const [nNetWeight, setNNetWeight] = useState(0)
  const [nWaterWeight, setNWaterWeight] = useState(0)
  const [nRate, setNRate] = useState(lastRates?.nRate || 68)
  const [nLabour, setNLabour] = useState(1600)
  const [paidAmount, setPaidAmount] = useState(0)
  const [oldAmount, setOldAmount] = useState(initialOldAmount)
  const [oldType, setOldType] = useState<DiffType>(initialOldType)
  const [finalType, setFinalType] = useState<DiffType>('BALANCE')
  const [finalAmount, setFinalAmount] = useState(0)

  const nTotalHens = nBox1 * nHen1 + nBox2 * nHen2
  const nWeight = nNetWeight - nWaterWeight
  const nAmount = nWeight * nRate
  const nTotal = nAmount + nLabour

  useEffect(() => {
    setOldAmount(initialOldAmount)
    setOldType(initialOldType || 'BALANCE')
  }, [initialOldAmount, initialOldType])

  useEffect(() => {
    if (lastRates?.nRate) {
      setNRate(lastRates.nRate)
    }
  }, [lastRates?.nRate])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const submitData: NallaFormData = {
      henType: 'NALLA_KOLI',
      nBox1,
      nHen1,
      nBox2,
      nHen2,
      nTotalHens,
      nNetWeight,
      nWaterWeight,
      nWeight,
      nRate,
      nAmount,
      nLabour,
      totalAmount: nTotal,
      paidAmount,
      todayType: paidAmount > nTotal ? 'EXTRA' : 'BALANCE',
      todayAmount: Math.abs(nTotal - paidAmount),
      oldAmount,
      oldType,
      finalType,
      finalAmount,
    }
    onSubmit(submitData)
  }, [nBox1, nHen1, nBox2, nHen2, nNetWeight, nWaterWeight, nRate, nLabour, paidAmount, oldAmount, oldType, finalType, finalAmount])

  const handleFinalChange = (type: DiffType, amount: number) => {
    setFinalType(type)
    setFinalAmount(amount)
  }

  return (
    <div className="space-y-5">
      <Card className="border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-center text-yellow-300">
            நல்ல கோழி / Nalla Koli
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
                  value={nBox1 || ''}
                  onChange={(e) => setNBox1(Number(e.target.value) || 0)}
                  placeholder="Box"
                  className="flex-1"
                />
                <span className="text-slate-500">×</span>
                <Input
                  type="number"
                  value={nHen1 || ''}
                  onChange={(e) => setNHen1(Number(e.target.value) || 0)}
                  placeholder="Hen"
                  className="flex-1"
                />
                <span className="flex items-center text-slate-200 font-semibold min-w-[60px]">
                  = {nBox1 * nHen1}
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
                  value={nBox2 || ''}
                  onChange={(e) => setNBox2(Number(e.target.value) || 0)}
                  placeholder="Box"
                  className="flex-1"
                />
                <span className="text-slate-500">×</span>
                <Input
                  type="number"
                  value={nHen2 || ''}
                  onChange={(e) => setNHen2(Number(e.target.value) || 0)}
                  placeholder="Hen"
                  className="flex-1"
                />
                <span className="flex items-center text-slate-200 font-semibold min-w-[60px]">
                  = {nBox2 * nHen2}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <Label className="text-base font-semibold text-slate-200">
              Total Hens / மொத்த கோழிகள்
            </Label>
            <span className="text-xl font-bold text-yellow-400 font-mono">{nTotalHens}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Net Weight / மொத்த எடை (Kg)</Label>
              <Input
                type="number"
                value={nNetWeight || ''}
                onChange={(e) => setNNetWeight(Number(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Water Weight / தண்ணீர் எடை (Kg)</Label>
              <Input
                type="number"
                value={nWaterWeight || ''}
                onChange={(e) => setNWaterWeight(Number(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Weight / எடை (Kg)</Label>
              <div className="h-11 flex items-center text-slate-200 font-semibold font-mono">
                {nWeight} Kg
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Rate / விலை (₹)</Label>
              <Input
                type="number"
                value={nRate || ''}
                onChange={(e) => setNRate(Number(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Amount / தொகை (₹)</Label>
              <div className="h-11 flex items-center text-slate-200 font-semibold font-mono">
                {formatCurrency(nAmount)}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Labour / தொழிலாளர் (₹)</Label>
              <Input
                type="number"
                value={nLabour || ''}
                onChange={(e) => setNLabour(Number(e.target.value) || 0)}
                placeholder="1600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg border border-slate-600/50">
            <Label className="text-base font-semibold text-slate-100">
              Total / மொத்தம்
            </Label>
            <span className="text-xl font-bold text-green-400 font-mono">
              {formatCurrency(nTotal)}
            </span>
          </div>
        </CardContent>
      </Card>

      <BalanceSection
        totalAmount={nTotal}
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
