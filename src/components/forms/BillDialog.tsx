'use client'

import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { formatCurrency, type DiffType } from '@/lib/calculations'
import { Printer, Share2, X } from 'lucide-react'

interface Transaction {
  id: string
  date: string
  henType: 'KATTI_KOLI' | 'NALLA_KOLI' | 'BOTH'
  kBox1: number | null
  kHen1: number | null
  kBox2: number | null
  kHen2: number | null
  kBox3: number | null
  kHen3: number | null
  kTotalHens: number | null
  kFreeHen: number | null
  kRate: number | null
  kAmount: number | null
  kLabour: number | null
  kTotal: number | null
  nBox1: number | null
  nHen1: number | null
  nBox2: number | null
  nHen2: number | null
  nBox3: number | null
  nHen3: number | null
  nTotalHens: number | null
  nFreeHen: number | null
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

interface BillDialogProps {
  transaction: Transaction
  open: boolean
  onClose: () => void
}

export function BillDialog({ transaction, open, onClose }: BillDialogProps) {
  if (!open) return null

  const henTypeLabel = {
    KATTI_KOLI: 'Katti Koli',
    NALLA_KOLI: 'Nalla Koli',
    BOTH: 'Both Types',
  }[transaction.henType]

  const hasRow1 = (transaction.kBox1 || 0) > 0 || (transaction.kHen1 || 0) > 0
  const hasRow2 = (transaction.kBox2 || 0) > 0 || (transaction.kHen2 || 0) > 0
  const hasRow3 = (transaction.kBox3 || 0) > 0 || (transaction.kHen3 || 0) > 0
  const hasKFreeHen = (transaction.kFreeHen || 0) > 0

  const hasNRow1 = (transaction.nBox1 || 0) > 0 || (transaction.nHen1 || 0) > 0
  const hasNRow2 = (transaction.nBox2 || 0) > 0 || (transaction.nHen2 || 0) > 0
  const hasNRow3 = (transaction.nBox3 || 0) > 0 || (transaction.nHen3 || 0) > 0
  const hasNFreeHen = (transaction.nFreeHen || 0) > 0

  const formatRow = (box: number | null, hen: number | null) => {
    return `${box} Box x ${hen} Hen = ${(box || 0) * (hen || 0)}`
  }

  const renderRows = (tx: Transaction, type: 'k' | 'n') => {
    const rows: string[] = []
    
    if (type === 'k') {
      if ((tx.kBox1 || 0) > 0 || (tx.kHen1 || 0) > 0) {
        rows.push(`Row 1: ${formatRow(tx.kBox1, tx.kHen1)}`)
      }
      if ((tx.kBox2 || 0) > 0 || (tx.kHen2 || 0) > 0) {
        rows.push(`Row 2: ${formatRow(tx.kBox2, tx.kHen2)}`)
      }
      if ((tx.kBox3 || 0) > 0 || (tx.kHen3 || 0) > 0) {
        rows.push(`Row 3: ${formatRow(tx.kBox3, tx.kHen3)}`)
      }
    } else {
      if ((tx.nBox1 || 0) > 0 || (tx.nHen1 || 0) > 0) {
        rows.push(`Row 1: ${formatRow(tx.nBox1, tx.nHen1)}`)
      }
      if ((tx.nBox2 || 0) > 0 || (tx.nHen2 || 0) > 0) {
        rows.push(`Row 2: ${formatRow(tx.nBox2, tx.nHen2)}`)
      }
      if ((tx.nBox3 || 0) > 0 || (tx.nHen3 || 0) > 0) {
        rows.push(`Row 3: ${formatRow(tx.nBox3, tx.nHen3)}`)
      }
    }
    
    return rows
  }

  const handleShare = () => {
    let content = `Balamurugan Traders
Date: ${format(new Date(transaction.date), 'dd/MM/yyyy')}
${henTypeLabel}
==============================

`

    if (transaction.henType === 'KATTI_KOLI') {
      const rows = renderRows(transaction, 'k')
      if (rows.length > 0) content += rows.join(' | ') + '\n'
      if (hasKFreeHen) content += `Free Hens: ${transaction.kFreeHen}\n`
      content += `Total Hens: ${transaction.kTotalHens}
Rate: Rs.${transaction.kRate}
Amount: ${formatCurrency(transaction.kAmount || 0)}
Labour: ${formatCurrency(transaction.kLabour || 0)}
Total Amount: ${formatCurrency(transaction.kTotal || 0)}
==============================


`
    }

    if (transaction.henType === 'NALLA_KOLI') {
      const rows = renderRows(transaction, 'n')
      if (rows.length > 0) content += rows.join(' | ') + '\n'
      if (hasNFreeHen) content += `Free Hens: ${transaction.nFreeHen}\n`
      content += `Total Hens: ${transaction.nTotalHens}
Net Weight: ${transaction.nNetWeight} Kg
Water Weight: ${transaction.nWaterWeight} Kg
Weight: ${transaction.nWeight} Kg
Rate: Rs.${transaction.nRate}
Amount: ${formatCurrency(transaction.nAmount || 0)}
Total Amount: ${formatCurrency(transaction.totalAmount)}
==============================


`
    }

    if (transaction.henType === 'BOTH') {
      content += `KATTI KOLI\n`
      const kRows = renderRows(transaction, 'k')
      if (kRows.length > 0) content += kRows.join(' | ') + '\n'
      if (hasKFreeHen) content += `Free Hens: ${transaction.kFreeHen}\n`
      content += `Total Hens: ${transaction.kTotalHens}
Rate: Rs.${transaction.kRate}
Amount: ${formatCurrency(transaction.kAmount || 0)}
Labour: ${formatCurrency(transaction.kLabour || 0)}
Katti Total: ${formatCurrency(transaction.kTotal || 0)}

NALLA KOLI\n`
      const nRows = renderRows(transaction, 'n')
      if (nRows.length > 0) content += nRows.join(' | ') + '\n'
      if (hasNFreeHen) content += `Free Hens: ${transaction.nFreeHen}\n`
      content += `Total Hens: ${transaction.nTotalHens}
Net Weight: ${transaction.nNetWeight} Kg
Water Weight: ${transaction.nWaterWeight} Kg
Weight: ${transaction.nWeight} Kg
Rate: Rs.${transaction.nRate}
Amount: ${formatCurrency(transaction.nAmount || 0)}
==============================

Total Amount: ${formatCurrency(transaction.totalAmount)}
Paid: ${formatCurrency(transaction.paidAmount)}
${transaction.todayType === 'BALANCE' ? 'Balance' : 'Extra'}: ${formatCurrency(transaction.todayAmount)}
Old ${transaction.oldType}: ${formatCurrency(transaction.oldAmount)}
==============================


`
    }

    content += `Final ${transaction.finalType}: ${formatCurrency(transaction.finalAmount)}`

    const textarea = document.createElement('textarea')
    textarea.value = content
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    
    alert('Bill copied to clipboard! You can now paste it into WhatsApp.')
  }

  const renderKattiBill = () => {
    const rows = []
    if (hasRow1) rows.push(`Row 1: ${transaction.kBox1} Box x ${transaction.kHen1} Hen = ${(transaction.kBox1 || 0) * (transaction.kHen1 || 0)}`)
    if (hasRow2) rows.push(`Row 2: ${transaction.kBox2} Box x ${transaction.kHen2} Hen = ${(transaction.kBox2 || 0) * (transaction.kHen2 || 0)}`)
    if (hasRow3) rows.push(`Row 3: ${transaction.kBox3} Box x ${transaction.kHen3} Hen = ${(transaction.kBox3 || 0) * (transaction.kHen3 || 0)}`)
    
    return (
      <div className="space-y-2 text-sm">
        {rows.length > 0 && (
          <div className="text-black font-semibold">{rows.join(' | ')}</div>
        )}
        {hasKFreeHen && (
          <div className="text-black font-semibold">Free Hens: {transaction.kFreeHen}</div>
        )}
        <div className="text-black font-semibold">
          Total Hens: {transaction.kTotalHens}
        </div>
        <div className="text-black font-semibold">
          Rate: Rs.{transaction.kRate}
        </div>
        <div className="text-black font-semibold">
          Amount: {formatCurrency(transaction.kAmount || 0)}
        </div>
        <div className="text-black font-semibold">
          Labour: {formatCurrency(transaction.kLabour || 0)}
        </div>
        <div className="text-black font-bold border-t pt-2">
          Total Amount: {formatCurrency(transaction.kTotal || 0)}
        </div>
      </div>
    )
  }

  const renderNallaBill = () => {
    const rows = []
    if (hasNRow1) rows.push(`Row 1: ${transaction.nBox1} Box x ${transaction.nHen1} Hen = ${(transaction.nBox1 || 0) * (transaction.nHen1 || 0)}`)
    if (hasNRow2) rows.push(`Row 2: ${transaction.nBox2} Box x ${transaction.nHen2} Hen = ${(transaction.nBox2 || 0) * (transaction.nHen2 || 0)}`)
    if (hasNRow3) rows.push(`Row 3: ${transaction.nBox3} Box x ${transaction.nHen3} Hen = ${(transaction.nBox3 || 0) * (transaction.nHen3 || 0)}`)
    
    return (
      <div className="space-y-2 text-sm">
        {rows.length > 0 && (
          <div className="text-black font-semibold">{rows.join(' | ')}</div>
        )}
        {hasNFreeHen && (
          <div className="text-black font-semibold">Free Hens: {transaction.nFreeHen}</div>
        )}
        <div className="text-black font-semibold">
          Total Hens: {transaction.nTotalHens}
        </div>
        <div className="text-black font-semibold">
          Net Weight: {transaction.nNetWeight} Kg
        </div>
        <div className="text-black font-semibold">
          Water Weight: {transaction.nWaterWeight} Kg
        </div>
        <div className="text-black font-semibold">
          Weight: {transaction.nWeight} Kg
        </div>
        <div className="text-black font-semibold">
          Rate: Rs.{transaction.nRate}
        </div>
        <div className="text-black font-semibold">
          Amount: {formatCurrency(transaction.nAmount || 0)}
        </div>
        <div className="text-black font-bold border-t pt-2">
          Total Amount: {formatCurrency(transaction.totalAmount)}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6" id="bill-content">
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold text-black">Balamurugan Traders</h1>
            <p className="text-lg font-semibold mt-2 text-black">{henTypeLabel}</p>
            <p className="text-black font-medium">Date: {format(new Date(transaction.date), 'dd/MM/yyyy')}</p>
          </div>

          {transaction.henType === 'KATTI_KOLI' && renderKattiBill()}

          {transaction.henType === 'NALLA_KOLI' && renderNallaBill()}

          {transaction.henType === 'BOTH' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold border-b pb-2 mb-3 text-black">KATTI KOLI</h2>
                {renderKattiBill()}
              </div>

              <div>
                <h2 className="text-lg font-bold border-b pb-2 mb-3 text-black">NALLA KOLI</h2>
                {renderNallaBill()}
              </div>
            </div>
          )}

          <div className="border-t-2 border-black pt-4 mt-6">
            <div className="flex justify-between font-bold text-lg">
              <span className="text-black">Final {transaction.finalType}:</span>
              <span className={transaction.finalType === 'BALANCE' ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>
                {formatCurrency(transaction.finalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 p-6 border-t border-gray-200 bg-gray-50">
          <Button 
            onClick={() => window.print()} 
            className="flex-1 bg-black text-white hover:bg-gray-800"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button 
            onClick={handleShare} 
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
