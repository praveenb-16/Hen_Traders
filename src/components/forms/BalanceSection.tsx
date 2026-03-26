'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { calcFinal, formatCurrency } from '@/lib/calculations'
import type { DiffType } from '@/lib/calculations'
import { Edit2, Check, X } from 'lucide-react'

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

  // When first transaction status changes, initialize local values
  useEffect(() => {
    if (!isFirstTransaction && oldAmount > 0) {
      setLocalOldAmount(oldAmount)
      setLocalOldType(oldType)
    }
  }, [isFirstTransaction, oldAmount, oldType])

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
    // For first transaction, use local values (user input)
    // For subsequent transactions, use props or edited values
    const currentOldAmount = isFirstTransaction ? localOldAmount : (showOldInput ? localOldAmount : oldAmount)
    const currentOldType = isFirstTransaction ? localOldType : (showOldInput ? localOldType : oldType)
    
    // Always use calcFinal for all transactions
    const result = calcFinal(todayType, todayAmount, currentOldType, currentOldAmount)
    onFinalChange(result.finalType, result.finalAmount)
  }, [todayType, todayAmount, localOldAmount, localOldType, oldAmount, oldType, isFirstTransaction, onFinalChange, showOldInput])

  const handlePaidChange = (value: number) => {
    setPaidAmount(value)
    onPaidAmountChange(value)
  }

  const handleOldAmountChange = (value: number) => {
    setLocalOldAmount(value)
    if (isFirstTransaction) {
      onOldAmountChange(value)
    }
  }

  const handleOldTypeChange = (type: DiffType) => {
    setLocalOldType(type)
    if (isFirstTransaction) {
      onOldTypeChange(type)
    }
  }

  const handleSaveOldAmount = () => {
    onOldAmountChange(localOldAmount)
    onOldTypeChange(localOldType)
    setShowOldInput(false)
  }

  const handleCancelEdit = () => {
    setLocalOldAmount(oldAmount)
    setLocalOldType(oldType)
    setShowOldInput(false)
  }

  return (
    <div className="space-y-4 border-t border-slate-700/50 pt-5 mt-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-base text-slate-300 font-semibold">
            Paid Amount / செலுத்திய தொகை
          </Label>
          <Input
            type="number"
            value={paidAmount || ''}
            onChange={(e) => handlePaidChange(Number(e.target.value) || 0)}
            placeholder="0"
            className="text-lg font-semibold"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-base text-slate-300 font-semibold">
            Total Amount / மொத்தம்
          </Label>
          <div className="h-11 flex items-center text-lg font-semibold text-slate-100 font-mono">
            {formatCurrency(totalAmount)}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <Label className="text-base text-slate-300 font-semibold">
            {todayType === 'BALANCE' ? 'Today Balance / இன்று நிலுவை' : 'Today Extra / இன்று அதிகம்'}
          </Label>
          <span className={`text-lg font-bold font-mono ${todayType === 'BALANCE' ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(todayAmount)}
          </span>
        </div>
      </div>

      {!isFirstTransaction && (
        <div className="space-y-3">
          <div className={`p-4 rounded-lg border-2 ${oldType === 'BALANCE' ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-bold text-slate-200">
                  Previous / முந்தைய
                </Label>
                <p className="text-sm text-slate-500">
                  {oldType === 'BALANCE' ? 'Balance / நிலுவை' : 'Extra / அதிகம்'}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold font-mono ${oldType === 'BALANCE' ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(oldAmount)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-base text-slate-400 font-medium">Edit Old Balance / பழைய நிலுவை மாற்று</Label>
            {!showOldInput && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowOldInput(true)}
                className="text-green-400 hover:text-green-300"
              >
                <Edit2 className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
          
          {showOldInput && (
            <>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={localOldAmount || ''}
                  onChange={(e) => handleOldAmountChange(Number(e.target.value) || 0)}
                  placeholder="Enter old balance"
                  className="flex-1 font-medium"
                />
                <div className="flex rounded-lg overflow-hidden border border-slate-600">
                  <button
                    type="button"
                    onClick={() => setLocalOldType('BALANCE')}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors ${localOldType === 'BALANCE' ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  >
                    Balance
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocalOldType('EXTRA')}
                    className={`px-4 py-2.5 text-sm font-medium transition-colors ${localOldType === 'EXTRA' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  >
                    Extra
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleSaveOldAmount} className="bg-green-600 hover:bg-green-700">
                  <Check className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {isFirstTransaction && (
        <div className="space-y-3">
          <Label className="text-base text-slate-300 font-semibold">Old Balance / பழைய நிலுவை</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={localOldAmount || ''}
              onChange={(e) => handleOldAmountChange(Number(e.target.value) || 0)}
              onBlur={() => onOldAmountChange(localOldAmount)}
              placeholder="Enter old balance"
              className="flex-1 font-medium"
            />
            <div className="flex rounded-lg overflow-hidden border border-slate-600">
              <button
                type="button"
                onClick={() => handleOldTypeChange('BALANCE')}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${localOldType === 'BALANCE' ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Balance
              </button>
              <button
                type="button"
                onClick={() => handleOldTypeChange('EXTRA')}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${localOldType === 'EXTRA' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
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
