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

  // Fallback
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

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const dailyBalances = await prisma.dailyBalance.findMany({
      orderBy: { date: 'desc' },
      include: {
        kattiKoli: true,
        nallaKoli: true,
        bothTransaction: true,
      },
    })

    const transactions = dailyBalances.map((db) => assembleTransaction(db))
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const result = await prisma.$transaction(async (tx) => {
      const dailyBalance = await tx.dailyBalance.create({
        data: {
          date: new Date(),
          henType: body.henType,
          totalAmount: body.totalAmount || 0,
          paidAmount: body.paidAmount || 0,
          todayAmount: body.todayAmount || 0,
          todayType: body.todayType || 'BALANCE',
          oldAmount: body.oldAmount || 0,
          oldType: body.oldType || 'BALANCE',
          finalAmount: body.finalAmount || 0,
          finalType: body.finalType || 'BALANCE',
        },
      })

      if (body.henType === 'KATTI_KOLI') {
        await tx.kattiKoli.create({
          data: {
            date: new Date(),
            box1: body.kBox1 || 0,
            hen1: body.kHen1 || 0,
            box2: body.kBox2 || 0,
            hen2: body.kHen2 || 0,
            box3: body.kBox3 || null,
            hen3: body.kHen3 || null,
            totalHens: body.kTotalHens || 0,
            freeHen: body.kFreeHen || null,
            rate: body.kRate || 0,
            amount: body.kAmount || 0,
            labour: body.kLabour || 0,
            total: body.kTotal || 0,
            dailyBalanceId: dailyBalance.id,
          },
        })
      } else if (body.henType === 'NALLA_KOLI') {
        await tx.nallaKoli.create({
          data: {
            date: new Date(),
            box1: body.nBox1 || 0,
            hen1: body.nHen1 || 0,
            box2: body.nBox2 || 0,
            hen2: body.nHen2 || 0,
            box3: body.nBox3 || null,
            hen3: body.nHen3 || null,
            totalHens: body.nTotalHens || 0,
            freeHen: body.nFreeHen || null,
            netWeight: body.nNetWeight || 0,
            waterWeight: body.nWaterWeight || 0,
            weight: body.nWeight || 0,
            rate: body.nRate || 0,
            amount: body.nAmount || 0,
            labour: body.nLabour || 0,
            total: body.totalAmount || 0,
            dailyBalanceId: dailyBalance.id,
          },
        })
      } else if (body.henType === 'BOTH') {
        await tx.bothTransaction.create({
          data: {
            date: new Date(),
            kBox1: body.kBox1 || 0,
            kHen1: body.kHen1 || 0,
            kBox2: body.kBox2 || 0,
            kHen2: body.kHen2 || 0,
            kBox3: body.kBox3 || null,
            kHen3: body.kHen3 || null,
            kTotalHens: body.kTotalHens || 0,
            kFreeHen: body.kFreeHen || null,
            kRate: body.kRate || 0,
            kAmount: body.kAmount || 0,
            kLabour: body.kLabour || 0,
            kTotal: body.kTotal || 0,
            nBox1: body.nBox1 || 0,
            nHen1: body.nHen1 || 0,
            nBox2: body.nBox2 || 0,
            nHen2: body.nHen2 || 0,
            nBox3: body.nBox3 || null,
            nHen3: body.nHen3 || null,
            nTotalHens: body.nTotalHens || 0,
            nFreeHen: body.nFreeHen || null,
            nNetWeight: body.nNetWeight || 0,
            nWaterWeight: body.nWaterWeight || 0,
            nWeight: body.nWeight || 0,
            nRate: body.nRate || 0,
            nAmount: body.nAmount || 0,
            totalAmount: body.totalAmount || 0,
            dailyBalanceId: dailyBalance.id,
          },
        })
      }

      return dailyBalance
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}
