import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { TransactionData } from '@/lib/types'

function assembleTransaction(db: {
  id: string
  date: Date
  henType: string
  totalAmount: number
  paidAmount: number
  todayAmount: number
  todayType: string
  oldAmount: number
  oldType: string
  finalAmount: number
  finalType: string
  kattiKoli?: {
    box1: number; hen1: number; box2: number; hen2: number
    box3: number | null; hen3: number | null; totalHens: number
    freeHen: number | null; rate: number; amount: number
    labour: number; total: number
  } | null
  nallaKoli?: {
    box1: number; hen1: number; box2: number; hen2: number
    box3: number | null; hen3: number | null; totalHens: number
    freeHen: number | null; netWeight: number; waterWeight: number
    weight: number; rate: number; amount: number
    labour: number; total: number
  } | null
  bothTransaction?: {
    kBox1: number; kHen1: number; kBox2: number; kHen2: number
    kBox3: number | null; kHen3: number | null; kTotalHens: number
    kFreeHen: number | null; kRate: number; kAmount: number
    kLabour: number; kTotal: number
    nBox1: number; nHen1: number; nBox2: number; nHen2: number
    nBox3: number | null; nHen3: number | null; nTotalHens: number
    nFreeHen: number | null; nNetWeight: number; nWaterWeight: number
    nWeight: number; nRate: number; nAmount: number
    totalAmount: number
  } | null
}): TransactionData {
  const base = {
    id: db.id,
    date: db.date.toISOString(),
    henType: db.henType as TransactionData['henType'],
    totalAmount: db.totalAmount,
    paidAmount: db.paidAmount,
    todayAmount: db.todayAmount,
    todayType: db.todayType as TransactionData['todayType'],
    oldAmount: db.oldAmount,
    oldType: db.oldType as TransactionData['oldType'],
    finalAmount: db.finalAmount,
    finalType: db.finalType as TransactionData['finalType'],
  }

  if (db.henType === 'KATTI_KOLI' && db.kattiKoli) {
    const k = db.kattiKoli
    return {
      ...base,
      kBox1: k.box1, kHen1: k.hen1, kBox2: k.box2, kHen2: k.hen2,
      kBox3: k.box3, kHen3: k.hen3, kTotalHens: k.totalHens,
      kFreeHen: k.freeHen, kRate: k.rate, kAmount: k.amount,
      kLabour: k.labour, kTotal: k.total,
      nBox1: null, nHen1: null, nBox2: null, nHen2: null,
      nBox3: null, nHen3: null, nTotalHens: null, nFreeHen: null,
      nNetWeight: null, nWaterWeight: null, nWeight: null,
      nRate: null, nAmount: null, nLabour: null,
    }
  }

  if (db.henType === 'NALLA_KOLI' && db.nallaKoli) {
    const n = db.nallaKoli
    return {
      ...base,
      kBox1: null, kHen1: null, kBox2: null, kHen2: null,
      kBox3: null, kHen3: null, kTotalHens: null, kFreeHen: null,
      kRate: null, kAmount: null, kLabour: null, kTotal: null,
      nBox1: n.box1, nHen1: n.hen1, nBox2: n.box2, nHen2: n.hen2,
      nBox3: n.box3, nHen3: n.hen3, nTotalHens: n.totalHens,
      nFreeHen: n.freeHen, nNetWeight: n.netWeight,
      nWaterWeight: n.waterWeight, nWeight: n.weight,
      nRate: n.rate, nAmount: n.amount, nLabour: n.labour,
    }
  }

  if (db.henType === 'BOTH' && db.bothTransaction) {
    const b = db.bothTransaction
    return {
      ...base,
      kBox1: b.kBox1, kHen1: b.kHen1, kBox2: b.kBox2, kHen2: b.kHen2,
      kBox3: b.kBox3, kHen3: b.kHen3, kTotalHens: b.kTotalHens,
      kFreeHen: b.kFreeHen, kRate: b.kRate, kAmount: b.kAmount,
      kLabour: b.kLabour, kTotal: b.kTotal,
      nBox1: b.nBox1, nHen1: b.nHen1, nBox2: b.nBox2, nHen2: b.nHen2,
      nBox3: b.nBox3, nHen3: b.nHen3, nTotalHens: b.nTotalHens,
      nFreeHen: b.nFreeHen, nNetWeight: b.nNetWeight,
      nWaterWeight: b.nWaterWeight, nWeight: b.nWeight,
      nRate: b.nRate, nAmount: b.nAmount, nLabour: null,
    }
  }

  return {
    ...base,
    kBox1: null, kHen1: null, kBox2: null, kHen2: null,
    kBox3: null, kHen3: null, kTotalHens: null, kFreeHen: null,
    kRate: null, kAmount: null, kLabour: null, kTotal: null,
    nBox1: null, nHen1: null, nBox2: null, nHen2: null,
    nBox3: null, nHen3: null, nTotalHens: null, nFreeHen: null,
    nNetWeight: null, nWaterWeight: null, nWeight: null,
    nRate: null, nAmount: null, nLabour: null,
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const dailyBalance = await prisma.dailyBalance.findUnique({
      where: { id },
      include: {
        kattiKoli: true,
        nallaKoli: true,
        bothTransaction: true,
      },
    })

    if (!dailyBalance) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    const transaction = assembleTransaction(dailyBalance)
    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error fetching transaction:', error)
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 })
  }
}
