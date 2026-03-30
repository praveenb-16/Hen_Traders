'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BalanceSection } from './BalanceSection'
import { formatCurrency, type DiffType } from '@/lib/calculations'

interface BothFormProps {
  onSubmit: (data: BothFormData) => void
  lastRates?: { kRate?: number; nRate?: number }
  initialOldAmount?: number
  initialOldType?: DiffType
  isFirstTransaction?: boolean
}

export interface BothFormData {
  henType: 'BOTH'
  kBox1: number
  kHen1: number
  kBox2: number
  kHen2: number
  kBox3: number
  kHen3: number
  kTotalHens: number
  kFreeHen: number
  kRate: number
  kAmount: number
  kLabour: number
  kTotal: number
  nBox1: number
  nHen1: number
  nBox2: number
  nHen2: number
  nBox3: number
  nHen3: number
  nTotalHens: number
  nFreeHen: number
  nNetWeight: number
  nWaterWeight: number
  nWeight: number
  nRate: number
  nAmount: number
  totalAmount: number
  paidAmount: number
  todayType: DiffType
  todayAmount: number
  oldAmount: number
  oldType: DiffType
  finalType: DiffType
  finalAmount: number
}

export function BothForm({ onSubmit, lastRates, initialOldAmount = 0, initialOldType = 'BALANCE', isFirstTransaction = false }: BothFormProps) {
  const [kBox1, setKBox1] = useState(0)
  const [kHen1, setKHen1] = useState(0)
  const [kBox2, setKBox2] = useState(0)
  const [kHen2, setKHen2] = useState(0)
  const [kBox3, setKBox3] = useState(0)
  const [kHen3, setKHen3] = useState(0)
  const [kFreeHen, setKFreeHen] = useState(0)
  const [kRate, setKRate] = useState(lastRates?.kRate || 45)
  const [kLabour, setKLabour] = useState(1600)
  
  const [nBox1, setNBox1] = useState(0)
  const [nHen1, setNHen1] = useState(0)
  const [nBox2, setNBox2] = useState(0)
  const [nHen2, setNHen2] = useState(0)
  const [nBox3, setNBox3] = useState(0)
  const [nHen3, setNHen3] = useState(0)
  const [nFreeHen, setNFreeHen] = useState(0)
  const [nNetWeight, setNNetWeight] = useState(0)
  const [nWaterWeight, setNWaterWeight] = useState(0)
  const [nRate, setNRate] = useState(lastRates?.nRate || 68)

  const [paidAmount, setPaidAmount] = useState(0)
  const [oldAmount, setOldAmount] = useState(initialOldAmount)
  const [oldType, setOldType] = useState<DiffType>(initialOldType)
  const [finalType, setFinalType] = useState<DiffType>('BALANCE')
  const [finalAmount, setFinalAmount] = useState(0)

  const onSubmitRef = useRef(onSubmit)
  onSubmitRef.current = onSubmit

  const kTotalHens = kBox1 * kHen1 + kBox2 * kHen2 + kBox3 * kHen3
  const kAmount = kTotalHens * kRate
  const kTotal = kAmount + kLabour

  const nTotalHens = nBox1 * nHen1 + nBox2 * nHen2 + nBox3 * nHen3
  const nWeight = nNetWeight - nWaterWeight
  const nAmount = nWeight * nRate
  const totalAmount = kTotal + nAmount

  useEffect(() => {
    setOldAmount(initialOldAmount)
    setOldType(initialOldType || 'BALANCE')
  }, [initialOldAmount, initialOldType])

  useEffect(() => {
    if (lastRates?.kRate) {
      setKRate(lastRates.kRate)
    }
  }, [lastRates?.kRate])

  useEffect(() => {
    if (lastRates?.nRate) {
      setNRate(lastRates.nRate)
    }
  }, [lastRates?.nRate])

  useEffect(() => {
    const submitData: BothFormData = {
      henType: 'BOTH',
      kBox1,
      kHen1,
      kBox2,
      kHen2,
      kBox3,
      kHen3,
      kTotalHens,
      kFreeHen,
      kRate,
      kAmount,
      kLabour,
      kTotal,
      nBox1,
      nHen1,
      nBox2,
      nHen2,
      nBox3,
      nHen3,
      nTotalHens,
      nFreeHen,
      nNetWeight,
      nWaterWeight,
      nWeight,
      nRate,
      nAmount,
      totalAmount,
      paidAmount,
      todayType: paidAmount > totalAmount ? 'EXTRA' : 'BALANCE',
      todayAmount: Math.abs(totalAmount - paidAmount),
      oldAmount,
      oldType,
      finalType,
      finalAmount,
    }
    onSubmitRef.current(submitData)
  }, [kBox1, kHen1, kBox2, kHen2, kBox3, kHen3, kTotalHens, kFreeHen, kRate, kAmount, kLabour, kTotal, nBox1, nHen1, nBox2, nHen2, nBox3, nHen3, nTotalHens, nFreeHen, nNetWeight, nWaterWeight, nWeight, nRate, nAmount, paidAmount, oldAmount, oldType, finalType, finalAmount, totalAmount])

  const handleFinalChange = (type: DiffType, amount: number) => {
    setFinalType(type)
    setFinalAmount(amount)
  }

  const renderRow = (box: number, hen: number, boxSetter: (v: number) => void, henSetter: (v: number) => void, label: string) => (
    <div className="space-y-2">
      <Label>
        {label} <span className="text-slate-500">(Box × Hen)</span>
      </Label>
      <div className="flex gap-2 items-center">
        <Input
          type="number"
          value={box || ''}
          onChange={(e) => boxSetter(Number(e.target.value) || 0)}
          placeholder="Box"
          className="flex-1"
        />
        <span className="text-slate-500">×</span>
        <Input
          type="number"
          value={hen || ''}
          onChange={(e) => henSetter(Number(e.target.value) || 0)}
          placeholder="Hen"
          className="flex-1"
        />
        <span className="flex items-center text-slate-200 font-semibold min-w-[60px]">
          = {box * hen}
        </span>
      </div>
    </div>
  )

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
            {renderRow(kBox1, kHen1, setKBox1, setKHen1, 'Row 1 / வரிசை 1')}
            {renderRow(kBox2, kHen2, setKBox2, setKHen2, 'Row 2 / வரிசை 2')}
          </div>

          {renderRow(kBox3, kHen3, setKBox3, setKHen3, 'Row 3 / வரிசை 3')}

          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <Label className="text-base font-semibold text-slate-200">
              Total Hens / மொத்த கோழிகள்
            </Label>
            <span className="text-xl font-bold text-orange-400 font-mono">{kTotalHens}</span>
          </div>

          <div className="flex items-center gap-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
            <Label className="text-base font-semibold text-purple-300">
              Free Hens / இலவை கோழி
            </Label>
            <Input
              type="number"
              value={kFreeHen || ''}
              onChange={(e) => setKFreeHen(Number(e.target.value) || 0)}
              placeholder="0"
              className="flex-1 max-w-[120px]"
            />
            <span className="text-purple-300 font-medium">hens</span>
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
              Katti Total / கட்டி மொத்தம்
            </Label>
            <span className="text-xl font-bold text-orange-400 font-mono">
              {formatCurrency(kTotal)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-xl text-center text-yellow-300">
            நல்ல கோழி / Nalla Koli
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderRow(nBox1, nHen1, setNBox1, setNHen1, 'Row 1 / வரிசை 1')}
            {renderRow(nBox2, nHen2, setNBox2, setNHen2, 'Row 2 / வரிசை 2')}
          </div>

          {renderRow(nBox3, nHen3, setNBox3, setNHen3, 'Row 3 / வரிசை 3')}

          <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
            <Label className="text-base font-semibold text-slate-200">
              Total Hens / மொத்த கோழிகள்
            </Label>
            <span className="text-xl font-bold text-yellow-400 font-mono">{nTotalHens}</span>
          </div>

          <div className="flex items-center gap-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg">
            <Label className="text-base font-semibold text-purple-300">
              Free Hens / இலவை கோழி
            </Label>
            <Input
              type="number"
              value={nFreeHen || ''}
              onChange={(e) => setNFreeHen(Number(e.target.value) || 0)}
              placeholder="0"
              className="flex-1 max-w-[120px]"
            />
            <span className="text-purple-300 font-medium">hens</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-green-500/30 bg-gradient-to-r from-slate-900 to-green-900/10">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <Label className="text-xl font-bold text-slate-100">
              Combined Total / ஒட்டுமொத்தம்
            </Label>
            <span className="text-2xl font-bold text-green-400 font-mono">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </CardContent>
      </Card>

      <BalanceSection
        totalAmount={totalAmount}
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
