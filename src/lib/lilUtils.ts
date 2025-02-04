import { getMonth } from 'date-fns'

export const monthsLongList: monthsLong[] = [
	'January',
	'Febuary',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
]

export const monthsShortList: monthsShort[] = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
]

// typescript 'overloads': https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads
export function returnMonth(date: Date, config: { returnType: 'long' }): monthsLong
export function returnMonth(date: Date, config: { returnType: 'short' }): monthsShort
export function returnMonth(date: Date, config: { returnType: 'long' | 'short' }) {
	const { returnType } = config
	const index = getMonth(date)
	const monthNameLong: monthsLong = monthsLongList[index]
	const monthNameShort: monthsShort = monthsShortList[index]

	if (returnType === 'long') return monthNameLong
	if (returnType === 'short') return monthNameShort
}

export async function to<T>(promise: Promise<T>) {
	const result: { res: null | Awaited<T>; err: null | Awaited<T> | unknown } = {
		res: null,
		err: null
	}

	try {
		const res = await promise
		result.res = res

		return result
	} catch (err: unknown) {
		result.err = err

		return result
	}
}

export interface numFormatConfig {
	style?: 'currency' | 'decimal'
	min?: number
	max?: number
}

export const numFormat = (
	num: number | null | undefined,
	config: numFormatConfig = {}
): string | null => {
	if (!num) return ''

	const formatter = new Intl.NumberFormat('en-US', {
		style: config.style ?? 'currency',
		currency: 'USD',

		// These options are needed to round to whole numbers if that's what you want.
		minimumFractionDigits: config.min ?? 0,
		maximumFractionDigits: config.max ?? 2
	})

	return formatter.format(num)
}

export const centsToDollars = (num: number | null | undefined): string | null => {
	if (!num) return '$0'
	const dollars = num / 100
	const config = {
		min: 2
	}

	return numFormat(dollars, config)
}

export const isNegative = (num: number): boolean => {
	if (Math.sign(num) === -1) return true

	return false
}

export const isPositive = (num: number): boolean => {
	if (Math.sign(num) === 1) return true

	return false
}

export function fillErrorBag(errors: issueApiErr[]) {
	const results: errorBagType = {}
	errors.forEach(item => {
		const key = item.path[0]
		if (key) results[key] = item.message
	})

	return results
}
