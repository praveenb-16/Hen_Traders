'use client'

import { useState, useEffect } from 'react'
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
  // Katti Koli
  kBox1: number
  kHen1: number
  kBox2: number
  kHen2: number
  kTotalHens: number
  kRate: number
  kAmount: number
  kLabour: number
  kTotal: number
  // Nalla Koli
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
  // Combined
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
  // Katti Koli fields
  const [kBox1, setKBox1] = useState(0)
  const [kHen1, setKHen1] = useState(0)
  const [kBox2, setKBox2] = useState(0)
  const [kHen2, setKHen2] = useState(0)
  const [kRate, setKRate] = useState(lastRates?.kRate || 45)
  const [kLabour, setKLabour] = useState(1600)
  
  // Nalla Koli fields
  const [nBox1, setNBox1] = useState(0)
  const [nHen1, setNHen1] = useState(0)
  const [nBox2, setNBox2] = useState(0)
  const [nHen2, setNHen2] = useState(0)
  const [nNetWeight, setNNetWeight] = useState(0)
  const [nWaterWeight, setNWaterWeight] = useState(0)
  const [nRate, setNRate] = useState(lastRates?.nRate || 68)
  
  // Balance fields
  const [paidAmount, setPaidAmount] = useState(0)
  const [oldAmount, setOldAmount] = useState(initialOldAmount)
  const [oldType, setOldType] = useState<DiffType>(initialOldType)
  const [finalType, setFinalType] = useState<DiffType>('BALANCE')
  const [finalAmount, setFinalAmount] = useState(0)

  // Katti calculations
  const kTotalHens = kBox1 * kHen1 + kBox2 * kHen2
  const kAmount = kTotalHens * kRate
  const kTotal = kAmount + kLabour

  // Nalla calculations
  const nTotalHens = nBox1 * nHen1 + nBox2 * nHen2
  const nWeight = nNetWeight - nWaterWeight
  const nAmount = nWeight * nRate

  // Combined
  const totalAmount = kTotal + nAmount

  // Sync old amount/type from props when they change
  useEffect(() => {
    setOldAmount(initialOldAmount)
    setOldType(initialOldType || 'BALANCE')
  }, [initialOldAmount, initialOldType])

  // Sync rates from props when they change
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const submitData: BothFormData = {
      henType: 'BOTH',
      kBox1,
      kHen1,
      kBox2,
      kHen2,
      kTotalHens,
      kRate,
      kAmount,
      kLabour,
      kTotal,
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
      totalAmount,
      paidAmount,
      todayType: paidAmount > totalAmount ? 'EXTRA' : 'BALANCE',
      todayAmount: Math.abs(totalAmount - paidAmount),
      oldAmount,
      oldType,
      finalType,
      finalAmount,
    }
    onSubmit(submitData)
  }, [kBox1, kHen1, kBox2, kHen2, kRate, kLabour, nBox1, nHen1, nBox2, nHen2, nNetWeight, nWaterWeight, nRate, paidAmount, oldAmount, oldType, finalType, finalAmount])

  const handleFinalChange = (type: DiffType, amount: number) => {
    setFinalType(type)
    setFinalAmount(amount)
  }

  return (
    <div className="space-y-6">
      {/* Katti Koli Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">
            கட்டி கோழி / Katti Koli
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Row 1 / வரிசை 1 <span className="text-black">(Box × Hen)</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={kBox1 || ''}
                  onChange={(e) => setKBox1(Number(e.target.value) || 0)}
                  placeholder="Box"
                  className="flex-1 text-black"
                />
                <span className="flex items-center">×</span>
                <Input
                  type="number"
                  value={kHen1 || ''}
                  onChange={(e) => setKHen1(Number(e.target.value) || 0)}
                  placeholder="Hen"
                  className="flex-1 text-black"
                />
                <span className="flex items-center text-black font-semibold min-w-[60px]">
                  = {kBox1 * kHen1}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                Row 2 / வரிசை 2 <span className="text-black">(Box × Hen)</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={kBox2 || ''}
                  onChange={(e) => setKBox2(Number(e.target.value) || 0)}
                  placeholder="Box"
                  className="flex-1 text-black"
                />
                <span className="flex items-center">×</span>
                <Input
                  type="number"
                  value={kHen2 || ''}
                  onChange={(e) => setKHen2(Number(e.target.value) || 0)}
                  placeholder="Hen"
                  className="flex-1 text-black"
                />
                <span className="flex items-center text-black font-semibold min-w-[60px]">
                  = {kBox2 * kHen2}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
            <Label className="text-base font-semibold text-black">
              Total Hens / மொத்த கோழிகள்
            </Label>
            <span className="text-xl font-bold text-black">{kTotalHens}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-black font-medium">Rate / விலை (₹)</Label>
              <Input
                type="number"
                value={kRate || ''}
                onChange={(e) => setKRate(Number(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-black font-medium">Amount / தொகை (₹)</Label>
              <div className="h-10 flex items-center text-black font-semibold">
                {formatCurrency(kAmount)}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-black font-medium">Labour / தொழிலாளர் (₹)</Label>
              <Input
                type="number"
                value={kLabour || ''}
                onChange={(e) => setKLabour(Number(e.target.value) || 0)}
                placeholder="1600"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-200 rounded-md">
            <Label className="text-base font-semibold text-black">
              Katti Total / கட்டி மொத்தம்
            </Label>
            <span className="text-xl font-bold text-black">
              {formatCurrency(kTotal)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Nalla Koli Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-center">
            நல்ல கோழி / Nalla Koli
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>
                Row 1 / வரிசை 1 <span className="text-black">(Box × Hen)</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={nBox1 || ''}
                  onChange={(e) => setNBox1(Number(e.target.value) || 0)}
                  placeholder="Box"
                  className="flex-1 text-black"
                />
                <span className="flex items-center">×</span>
                <Input
                  type="number"
                  value={nHen1 || ''}
                  onChange={(e) => setNHen1(Number(e.target.value) || 0)}
                  placeholder="Hen"
                  className="flex-1 text-black"
                />
                <span className="flex items-center text-black font-semibold min-w-[60px]">
                  = {nBox1 * nHen1}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>
                Row 2 / வரிசை 2 <span className="text-black">(Box × Hen)</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={nBox2 || ''}
                  onChange={(e) => setNBox2(Number(e.target.value) || 0)}
                  placeholder="Box"
                  className="flex-1 text-black"
                />
                <span className="flex items-center">×</span>
                <Input
                  type="number"
                  value={nHen2 || ''}
                  onChange={(e) => setNHen2(Number(e.target.value) || 0)}
                  placeholder="Hen"
                  className="flex-1 text-black"
                />
                <span className="flex items-center text-black font-semibold min-w-[60px]">
                  = {nBox2 * nHen2}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
            <Label className="text-base font-semibold text-black">
              Total Hens / மொத்த கோழிகள்
            </Label>
            <span className="text-xl font-bold text-black">{nTotalHens}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-black font-medium">Net Weight / மொத்த எடை (Kg)</Label>
              <Input
                type="number"
                value={nNetWeight || ''}
                onChange={(e) => setNNetWeight(Number(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-black font-medium">Water Weight / தண்ணீர் எடை (Kg)</Label>
              <Input
                type="number"
                value={nWaterWeight || ''}
                onChange={(e) => setNWaterWeight(Number(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Weight / எடை (Kg)</Label>
              <div className="h-10 flex items-center text-black font-semibold">
                {nWeight} Kg
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black font-medium">Rate / விலை (₹)</Label>
              <Input
                type="number"
                value={nRate || ''}
                onChange={(e) => setNRate(Number(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-black font-medium">Amount / தொகை (₹)</Label>
              <div className="h-10 flex items-center text-black font-semibold">
                {formatCurrency(nAmount)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Combined Total */}
      <Card className="border-2 border-black">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <Label className="text-xl font-bold">
              Combined Total / ஒட்டுமொத்தம்
            </Label>
            <span className="text-2xl font-bold text-black">
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

      <div className="p-4 rounded-lg bg-green-50 border border-green-200">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold text-green-800">
            {finalType === 'BALANCE' ? 'Final Balance / இறுதி நிலுவை' : 'Final Extra / இறுதி அதிகம்'}
          </Label>
          <span className={`text-2xl font-bold ${finalType === 'BALANCE' ? 'text-green-700' : 'text-red-600'}`}>
            {formatCurrency(finalAmount)}
          </span>
        </div>
      </div>
    </div>
  )
}