'use client'


import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
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

  const formatRow = (box: number | null, hen: number | null) => {
    return `${box} Box x ${hen} Hen = ${(box || 0) * (hen || 0)}`
  }

  const getBillContent = () => {
    let content = `Balamurugan Traders
Date: ${format(new Date(transaction.date), 'dd/MM/yyyy')}
${henTypeLabel}
===============================

`

    if (transaction.henType === 'KATTI_KOLI') {
      content += `Row 1: ${formatRow(transaction.kBox1, transaction.kHen1)} | Row 2: ${formatRow(transaction.kBox2, transaction.kHen2)}
Total Hens: ${transaction.kTotalHens}
Rate: Rs.${transaction.kRate}
Amount: ${formatCurrency(transaction.kAmount || 0)} | Labour: ${formatCurrency(transaction.kLabour || 0)}
Total Amount: ${formatCurrency(transaction.kTotal || 0)}
Paid: ${formatCurrency(transaction.paidAmount)}
${transaction.todayType === 'BALANCE' ? 'Balance' : 'Extra'}: ${formatCurrency(transaction.todayAmount)}
Old ${transaction.oldType}: ${formatCurrency(transaction.oldAmount)}
===============================

`
    }

    if (transaction.henType === 'NALLA_KOLI') {
      content += `Row 1: ${formatRow(transaction.nBox1, transaction.nHen1)} | Row 2: ${formatRow(transaction.nBox2, transaction.nHen2)}
Total Hens: ${transaction.nTotalHens}
Net Weight: ${transaction.nNetWeight} Kg
Water Weight: ${transaction.nWaterWeight} Kg
Weight: ${transaction.nWeight} Kg
Rate: Rs.${transaction.nRate}
Amount: ${formatCurrency(transaction.nAmount || 0)} | Labour: ${formatCurrency(transaction.nLabour || 0)}
Total Amount: ${formatCurrency(transaction.totalAmount)}
Paid: ${formatCurrency(transaction.paidAmount)}
${transaction.todayType === 'BALANCE' ? 'Balance' : 'Extra'}: ${formatCurrency(transaction.todayAmount)}
Old ${transaction.oldType}: ${formatCurrency(transaction.oldAmount)}
===============================

`
    }

    if (transaction.henType === 'BOTH') {
      content += `KATTI KOLI
Row 1: ${formatRow(transaction.kBox1, transaction.kHen1)} | Row 2: ${formatRow(transaction.kBox2, transaction.kHen2)}
Total Hens: ${transaction.kTotalHens}
Rate: Rs.${transaction.kRate}
Amount: ${formatCurrency(transaction.kAmount || 0)} | Labour: ${formatCurrency(transaction.kLabour || 0)}
Katti Total: ${formatCurrency(transaction.kTotal || 0)}

NALLA KOLI
Row 1: ${formatRow(transaction.nBox1, transaction.nHen1)} | Row 2: ${formatRow(transaction.nBox2, transaction.nHen2)}
Total Hens: ${transaction.nTotalHens}
Net Weight: ${transaction.nNetWeight} Kg
Water Weight: ${transaction.nWaterWeight} Kg
Weight: ${transaction.nWeight} Kg
Rate: Rs.${transaction.nRate}
Amount: ${formatCurrency(transaction.nAmount || 0)} | Labour: ${formatCurrency(transaction.nLabour || 0)}
===============================

Total Amount: ${formatCurrency(transaction.totalAmount)}
Paid: ${formatCurrency(transaction.paidAmount)}
${transaction.todayType === 'BALANCE' ? 'Balance' : 'Extra'}: ${formatCurrency(transaction.todayAmount)}
Old ${transaction.oldType}: ${formatCurrency(transaction.oldAmount)}
===============================

`
    }

    content += `Final ${transaction.finalType}: ${formatCurrency(transaction.finalAmount)}`

    return content
  }

  const handleShare = () => {
    const billContent = getBillContent()
    const textarea = document.createElement('textarea')
    textarea.value = billContent
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    
    alert('Bill copied to clipboard! You can now paste it into WhatsApp.')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto border-2 border-black">
        <div className="p-6" id="bill-content">
          <div className="text-center border-b-2 border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold text-black">Balamurugan Traders</h1>
            <p className="text-lg font-semibold mt-2 text-black">{henTypeLabel}</p>
            <p className="text-black font-medium">Date: {format(new Date(transaction.date), 'dd/MM/yyyy')}</p>
          </div>

          {transaction.henType === 'KATTI_KOLI' && (
            <div className="space-y-2 text-sm">
              <div className="text-black font-semibold">
                Row 1: {transaction.kBox1} Box x {transaction.kHen1} Hen = {(transaction.kBox1 || 0) * (transaction.kHen1 || 0)} | Row 2: {transaction.kBox2} Box x {transaction.kHen2} Hen = {(transaction.kBox2 || 0) * (transaction.kHen2 || 0)}
              </div>
              <div className="text-black font-semibold">
                Total Hens: {transaction.kTotalHens}
              </div>
              <div className="text-black font-semibold">
                Rate: Rs.{transaction.kRate}
              </div>
              <div className="text-black font-semibold">
                Amount: {formatCurrency(transaction.kAmount || 0)} | Labour: {formatCurrency(transaction.kLabour || 0)}
              </div>
              <div className="text-black font-bold border-t pt-2">
                Total Amount: {formatCurrency(transaction.kTotal || 0)}
              </div>
              <div className="text-black font-semibold">
                Paid: {formatCurrency(transaction.paidAmount)}
              </div>
              <div className="text-black font-semibold">
                {transaction.todayType === 'BALANCE' ? 'Balance' : 'Extra'}: {formatCurrency(transaction.todayAmount)}
              </div>
              <div className="text-black font-semibold">
                Old {transaction.oldType}: {formatCurrency(transaction.oldAmount)}
              </div>
            </div>
          )}

          {transaction.henType === 'NALLA_KOLI' && (
            <div className="space-y-2 text-sm">
              <div className="text-black font-semibold">
                Row 1: {transaction.nBox1} Box x {transaction.nHen1} Hen = {(transaction.nBox1 || 0) * (transaction.nHen1 || 0)} | Row 2: {transaction.nBox2} Box x {transaction.nHen2} Hen = {(transaction.nBox2 || 0) * (transaction.nHen2 || 0)}
              </div>
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
                Amount: {formatCurrency(transaction.nAmount || 0)} | Labour: {formatCurrency(transaction.nLabour || 0)}
              </div>
              <div className="text-black font-bold border-t pt-2">
                Total Amount: {formatCurrency(transaction.totalAmount)}
              </div>
              <div className="text-black font-semibold">
                Paid: {formatCurrency(transaction.paidAmount)}
              </div>
              <div className="text-black font-semibold">
                {transaction.todayType === 'BALANCE' ? 'Balance' : 'Extra'}: {formatCurrency(transaction.todayAmount)}
              </div>
              <div className="text-black font-semibold">
                Old {transaction.oldType}: {formatCurrency(transaction.oldAmount)}
              </div>
            </div>
          )}

          {transaction.henType === 'BOTH' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold border-b pb-2 mb-3 text-black">KATTI KOLI</h2>
                <div className="space-y-2 text-sm">
                  <div className="text-black font-semibold">
                    Row 1: {transaction.kBox1} Box x {transaction.kHen1} Hen = {(transaction.kBox1 || 0) * (transaction.kHen1 || 0)} | Row 2: {transaction.kBox2} Box x {transaction.kHen2} Hen = {(transaction.kBox2 || 0) * (transaction.kHen2 || 0)}
                  </div>
                  <div className="text-black font-semibold">
                    Total Hens: {transaction.kTotalHens}
                  </div>
                  <div className="text-black font-semibold">
                    Rate: Rs.{transaction.kRate}
                  </div>
                  <div className="text-black font-semibold">
                    Amount: {formatCurrency(transaction.kAmount || 0)} | Labour: {formatCurrency(transaction.kLabour || 0)}
                  </div>
                  <div className="text-black font-bold">
                    Katti Total: {formatCurrency(transaction.kTotal || 0)}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold border-b pb-2 mb-3 text-black">NALLA KOLI</h2>
                <div className="space-y-2 text-sm">
                  <div className="text-black font-semibold">
                    Row 1: {transaction.nBox1} Box x {transaction.nHen1} Hen = {(transaction.nBox1 || 0) * (transaction.nHen1 || 0)} | Row 2: {transaction.nBox2} Box x {transaction.nHen2} Hen = {(transaction.nBox2 || 0) * (transaction.nHen2 || 0)}
                  </div>
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
                    Amount: {formatCurrency(transaction.nAmount || 0)} | Labour: {formatCurrency(transaction.nLabour || 0)}
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-black pt-4 space-y-2 text-sm">
                <div className="text-black font-bold">
                  Total Amount: {formatCurrency(transaction.totalAmount)}
                </div>
                <div className="text-black font-semibold">
                  Paid: {formatCurrency(transaction.paidAmount)}
                </div>
                <div className="text-black font-semibold">
                  {transaction.todayType === 'BALANCE' ? 'Balance' : 'Extra'}: {formatCurrency(transaction.todayAmount)}
                </div>
                <div className="text-black font-semibold">
                  Old {transaction.oldType}: {formatCurrency(transaction.oldAmount)}
                </div>
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

        <div className="flex gap-2 p-6 border-t border-black">
          <Button 
            onClick={() => window.print()} 
            className="flex-1 bg-black text-white hover:bg-gray-800"
          >
            Print
          </Button>
          <Button 
            onClick={handleShare} 
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
          >
            Share
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 border-black text-black hover:bg-gray-100"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}