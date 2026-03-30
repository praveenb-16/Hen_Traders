import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const latestBalance = await prisma.dailyBalance.findFirst({
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' }
      ],
      select: {
        finalAmount: true,
        finalType: true,
      },
    })

    if (!latestBalance) {
      return NextResponse.json({ 
        hasPrevious: false,
        kRate: 45,
        nRate: 68,
        finalAmount: 0,
        finalType: 'BALANCE'
      })
    }

    const latestKatti = await prisma.kattiKoli.findFirst({
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      select: { rate: true },
    })

    const latestNalla = await prisma.nallaKoli.findFirst({
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      select: { rate: true },
    })

    const latestBoth = await prisma.bothTransaction.findFirst({
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      select: { kRate: true, nRate: true },
    })

    let kRate = 45
    let nRate = 68

    if (latestBoth) {
      kRate = latestBoth.kRate || 45
      nRate = latestBoth.nRate || 68
    } else {
      if (latestKatti) kRate = latestKatti.rate || 45
      if (latestNalla) nRate = latestNalla.rate || 68
    }

    return NextResponse.json({
      hasPrevious: true,
      finalAmount: latestBalance.finalAmount || 0,
      finalType: latestBalance.finalType || 'BALANCE',
      kRate,
      nRate,
    })
  } catch (error) {
    console.error('Error fetching latest transaction:', error)
    return NextResponse.json({ 
      hasPrevious: false,
      kRate: 45,
      nRate: 68,
      finalAmount: 0,
      finalType: 'BALANCE'
    })
  }
}
