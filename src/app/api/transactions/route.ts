import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
    })
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(),
        henType: body.henType,
        
        // Katti Koli fields
        kBox1: body.kBox1 || null,
        kHen1: body.kHen1 || null,
        kBox2: body.kBox2 || null,
        kHen2: body.kHen2 || null,
        kTotalHens: body.kTotalHens || null,
        kRate: body.kRate || null,
        kAmount: body.kAmount || null,
        kLabour: body.kLabour || null,
        kTotal: body.kTotal || null,
        
        // Nalla Koli fields
        nBox1: body.nBox1 || null,
        nHen1: body.nHen1 || null,
        nBox2: body.nBox2 || null,
        nHen2: body.nHen2 || null,
        nTotalHens: body.nTotalHens || null,
        nNetWeight: body.nNetWeight || null,
        nWaterWeight: body.nWaterWeight || null,
        nWeight: body.nWeight || null,
        nRate: body.nRate || null,
        nAmount: body.nAmount || null,
        nLabour: body.nLabour || null,
        
        // Combined
        totalAmount: body.totalAmount || 0,
        paidAmount: body.paidAmount || 0,
        todayType: body.todayType || 'BALANCE',
        todayAmount: body.todayAmount || 0,
        oldAmount: body.oldAmount || 0,
        oldType: body.oldType || 'BALANCE',
        finalType: body.finalType || 'BALANCE',
        finalAmount: body.finalAmount || 0,
      },
    })
    
    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}