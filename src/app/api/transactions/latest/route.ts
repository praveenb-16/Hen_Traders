import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const latestTransaction = await prisma.transaction.findFirst({
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' }
      ],
      select: {
        finalAmount: true,
        finalType: true,
        kRate: true,
        nRate: true,
      },
    })

    if (!latestTransaction) {
      return NextResponse.json({ 
        hasPrevious: false,
        kRate: 45,
        nRate: 68,
        finalAmount: 0,
        finalType: 'BALANCE'
      })
    }

    return NextResponse.json({
      hasPrevious: true,
      finalAmount: latestTransaction.finalAmount || 0,
      finalType: latestTransaction.finalType || 'BALANCE',
      kRate: latestTransaction.kRate || 45,
      nRate: latestTransaction.nRate || 68,
    })
  } catch (error) {
    console.error('Error fetching latest transaction:', error)
    // Return default values instead of error
    return NextResponse.json({ 
      hasPrevious: false,
      kRate: 45,
      nRate: 68,
      finalAmount: 0,
      finalType: 'BALANCE'
    })
  }
}