export type DiffType = 'BALANCE' | 'EXTRA'

export interface TransactionData {
  id: string
  date: string
  henType: 'KATTI_KOLI' | 'NALLA_KOLI' | 'BOTH'

  // Katti Koli fields (nullable when henType is NALLA_KOLI)
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

  // Nalla Koli fields (nullable when henType is KATTI_KOLI)
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

  // Balance fields
  totalAmount: number
  paidAmount: number
  todayAmount: number
  todayType: DiffType
  oldAmount: number
  oldType: DiffType
  finalAmount: number
  finalType: DiffType
}
