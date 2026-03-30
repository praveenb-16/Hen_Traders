import { describe, it, expect } from 'vitest'
import { calcFinal, formatCurrency, formatDate } from '../calculations'

describe('calcFinal', () => {
  it('BALANCE + BALANCE => BALANCE (sum)', () => {
    const result = calcFinal('BALANCE', 1000, 'BALANCE', 500)
    expect(result).toEqual({ finalType: 'BALANCE', finalAmount: 1500 })
  })

  it('BALANCE + BALANCE => BALANCE (zero old)', () => {
    const result = calcFinal('BALANCE', 2000, 'BALANCE', 0)
    expect(result).toEqual({ finalType: 'BALANCE', finalAmount: 2000 })
  })

  it('BALANCE + EXTRA => BALANCE (today >= old)', () => {
    const result = calcFinal('BALANCE', 1000, 'EXTRA', 500)
    expect(result).toEqual({ finalType: 'BALANCE', finalAmount: 500 })
  })

  it('BALANCE + EXTRA => EXTRA (today < old)', () => {
    const result = calcFinal('BALANCE', 300, 'EXTRA', 500)
    expect(result).toEqual({ finalType: 'EXTRA', finalAmount: 200 })
  })

  it('BALANCE + EXTRA => BALANCE (equal)', () => {
    const result = calcFinal('BALANCE', 500, 'EXTRA', 500)
    expect(result).toEqual({ finalType: 'BALANCE', finalAmount: 0 })
  })

  it('EXTRA + EXTRA => EXTRA (sum)', () => {
    const result = calcFinal('EXTRA', 300, 'EXTRA', 200)
    expect(result).toEqual({ finalType: 'EXTRA', finalAmount: 500 })
  })

  it('EXTRA + BALANCE => BALANCE (old >= today)', () => {
    const result = calcFinal('EXTRA', 300, 'BALANCE', 1000)
    expect(result).toEqual({ finalType: 'BALANCE', finalAmount: 700 })
  })

  it('EXTRA + BALANCE => EXTRA (old < today)', () => {
    const result = calcFinal('EXTRA', 1000, 'BALANCE', 300)
    expect(result).toEqual({ finalType: 'EXTRA', finalAmount: 700 })
  })

  it('EXTRA + BALANCE => BALANCE (equal)', () => {
    const result = calcFinal('EXTRA', 500, 'BALANCE', 500)
    expect(result).toEqual({ finalType: 'BALANCE', finalAmount: 0 })
  })

  it('handles zero amounts', () => {
    const result = calcFinal('BALANCE', 0, 'BALANCE', 0)
    expect(result).toEqual({ finalType: 'BALANCE', finalAmount: 0 })
  })

  it('handles large amounts', () => {
    const result = calcFinal('BALANCE', 100000, 'BALANCE', 50000)
    expect(result).toEqual({ finalType: 'BALANCE', finalAmount: 150000 })
  })
})

describe('formatCurrency', () => {
  it('formats integer amounts in INR', () => {
    expect(formatCurrency(1000)).toBe('₹1,000')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('₹0')
  })

  it('formats large amounts', () => {
    expect(formatCurrency(100000)).toBe('₹1,00,000')
  })

  it('formats decimal amounts (rounds to whole)', () => {
    expect(formatCurrency(1234.56)).toBe('₹1,235')
  })

  it('formats negative amounts', () => {
    expect(formatCurrency(-500)).toBe('-₹500')
  })
})

describe('formatDate', () => {
  it('formats date in DD/MM/YY', () => {
    const date = new Date(2026, 2, 25)
    expect(formatDate(date)).toBe('25/03/26')
  })

  it('formats date with single-digit day', () => {
    const date = new Date(2026, 0, 5)
    expect(formatDate(date)).toBe('05/01/26')
  })
})
