'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calcFinal, formatCurrency } from '@/lib/calculations'
import type { DiffType } from '@/lib/calculations'

interface BalanceSectionProps {
  totalAmount: number
  oldAmount: number
  oldType: DiffType
  onOldAmountChange: (amount: number) => void
  onOldTypeChange: (type: DiffType) => void
  onPaidAmountChange: (amount: number) => void
  onFinalChange: (type: DiffType, amount: number) => void
  isFirstTransaction?: boolean
}

export function BalanceSection({
  totalAmount,
  oldAmount,
  oldType,
  onOldAmountChange,
  onOldTypeChange,
  onPaidAmountChange,
  onFinalChange,
  isFirstTransaction = false,
}: BalanceSectionProps) {
  const [paidAmount, setPaidAmount] = useState(0)
  const [todayType, setTodayType] = useState<DiffType>('BALANCE')
  const [todayAmount, setTodayAmount] = useState(0)
  const [showOldInput, setShowOldInput] = useState(false)
  const [localOldAmount, setLocalOldAmount] = useState(oldAmount)
  const [localOldType, setLocalOldType] = useState<DiffType>(oldType)

  useEffect(() => {
    setLocalOldAmount(oldAmount)
    setLocalOldType(oldType)
  }, [oldAmount, oldType])

  useEffect(function computeTodayType() {
    if (paidAmount > totalAmount) {
      setTodayType('EXTRA')
      setTodayAmount(paidAmount - totalAmount)
    } else {
      setTodayType('BALANCE')
      setTodayAmount(totalAmount - paidAmount)
    }
  }, [paidAmount, totalAmount])

  useEffect(function computeFinal() {
    const currentOldAmount = showOldInput ? localOldAmount : oldAmount
    const currentOldType = showOldInput ? localOldType : oldType
    
    if (!isFirstTransaction) {
      const result = calcFinal(todayType, todayAmount, currentOldType, currentOldAmount)
      onFinalChange(result.finalType, result.finalAmount)
    } else {
      onFinalChange(todayType, todayAmount)
    }
  }, [todayType, todayAmount, localOldAmount, localOldType, oldAmount, oldType, isFirstTransaction, onFinalChange, showOldInput])

  const handlePaidChange = (value: number) => {
    setPaidAmount(value)
    onPaidAmountChange(value)
  }

  const handleOldAmountChange = (value: number) => {
    setLocalOldAmount(value)
  }

  const handleSaveOldAmount = () => {
    onOldAmountChange(localOldAmount)
    setShowOldInput(false)
  }

  const handleCancelEdit = () => {
    setLocalOldAmount(oldAmount)
    setLocalOldType(oldType)
    setShowOldInput(false)
  }

  return (
    <div className="space-y-4 border-t pt-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-base text-black font-semibold">
            Paid Amount / செலுத்திய தொகை
          </Label>
          <Input
            type="number"
            value={paidAmount || ''}
            onChange={(e) => handlePaidChange(Number(e.target.value) || 0)}
            placeholder="0"
            className="text-lg font-semibold text-black"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-base text-black font-semibold">
            Total Amount / மொத்தம்
          </Label>
          <div className="h-10 flex items-center text-lg font-semibold text-black">
            {formatCurrency(totalAmount)}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-gray-200">
        <div className="flex items-center justify-between">
          <Label className="text-base text-black font-semibold">
            {todayType === 'BALANCE' ? 'Balance / நிலுவை' : 'Extra / அதிகம்'}
          </Label>
          <span className={`text-lg font-bold ${todayType === 'BALANCE' ? 'text-green-700' : 'text-red-600'}`}>
            {formatCurrency(todayAmount)}
          </span>
        </div>
      </div>

      {!isFirstTransaction && (
        <div className="space-y-3">
          {/* Previous Balance Card - Blue Color */}
          <div className={`p-4 rounded-lg border-2 ${oldType === 'BALANCE' ? 'bg-blue-50 border-blue-500' : 'bg-red-50 border-red-500'}`}>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-bold text-black">
                  Previous / முந்தைய
                </Label>
                <p className="text-sm text-gray-600">
                  {oldType === 'BALANCE' ? 'Balance / நிலுவை' : 'Extra / அதிகம்'}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${oldType === 'BALANCE' ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(oldAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-base text-black font-semibold">Edit Old Balance / பழைய நிலுவை மாற்று</Label>
            {!showOldInput && (
              <button
                type="button"
                onClick={() => setShowOldInput(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Edit
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={showOldInput ? localOldAmount : oldAmount || ''}
              onChange={(e) => handleOldAmountChange(Number(e.target.value) || 0)}
              placeholder={showOldInput ? "Enter old balance" : undefined}
              className="flex-1 text-black font-medium"
              readOnly={!showOldInput}
            />
            <div className="flex rounded-md overflow-hidden border">
              <button
                type="button"
                onClick={() => {
                  const newType: DiffType = 'BALANCE'
                  setLocalOldType(newType)
                  if (showOldInput) {
                    onOldTypeChange(newType)
                  }
                }}
                className={`px-3 py-2 text-sm font-medium ${localOldType === 'BALANCE' ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-slate-100'}`}
              >
                Balance
              </button>
              <button
                type="button"
                onClick={() => {
                  const newType: DiffType = 'EXTRA'
                  setLocalOldType(newType)
                  if (showOldInput) {
                    onOldTypeChange(newType)
                  }
                }}
                className={`px-3 py-2 text-sm font-medium ${localOldType === 'EXTRA' ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-slate-100'}`}
              >
                Extra
              </button>
            </div>
          </div>
          
          {showOldInput && (
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={handleSaveOldAmount}
                className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-300 text-black rounded-md font-medium hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {isFirstTransaction && (
        <div className="space-y-2">
          <Label className="text-base text-black font-semibold">Old Balance / பழைய நிலுவை</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={localOldAmount || ''}
              onChange={(e) => handleOldAmountChange(Number(e.target.value) || 0)}
              onBlur={() => onOldAmountChange(localOldAmount)}
              placeholder="Enter old balance"
              className="flex-1 text-black font-medium"
            />
            <div className="flex rounded-md overflow-hidden border">
              <button
                type="button"
                onClick={() => {
                  const newType: DiffType = 'BALANCE'
                  setLocalOldType(newType)
                  onOldTypeChange(newType)
                }}
                className={`px-3 py-2 text-sm font-medium ${localOldType === 'BALANCE' ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-slate-100'}`}
              >
                Balance
              </button>
              <button
                type="button"
                onClick={() => {
                  const newType: DiffType = 'EXTRA'
                  setLocalOldType(newType)
                  onOldTypeChange(newType)
                }}
                className={`px-3 py-2 text-sm font-medium ${localOldType === 'EXTRA' ? 'bg-red-600 text-white' : 'bg-white text-black hover:bg-slate-100'}`}
              >
                Extra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}