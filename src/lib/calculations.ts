export type DiffType = 'BALANCE' | 'EXTRA'

export interface BalanceResult {
  finalType: DiffType
  finalAmount: number
}

export function calcFinal(
  todayType: DiffType,
  todayAmount: number,
  oldType: DiffType,
  oldAmount: number
): BalanceResult {
  if (todayType === 'BALANCE' && oldType === 'BALANCE') {
    return { finalType: 'BALANCE', finalAmount: todayAmount + oldAmount }
  }

  if (todayType === 'BALANCE' && oldType === 'EXTRA') {
    const result = todayAmount - oldAmount
    return result >= 0
      ? { finalType: 'BALANCE', finalAmount: result }
      : { finalType: 'EXTRA', finalAmount: Math.abs(result) }
  }

  if (todayType === 'EXTRA' && oldType === 'EXTRA') {
    return { finalType: 'EXTRA', finalAmount: todayAmount + oldAmount }
  }

  if (todayType === 'EXTRA' && oldType === 'BALANCE') {
    const result = oldAmount - todayAmount
    return result >= 0
      ? { finalType: 'BALANCE', finalAmount: result }
      : { finalType: 'EXTRA', finalAmount: Math.abs(result) }
  }

  return { finalType: 'BALANCE', finalAmount: 0 }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date)
}