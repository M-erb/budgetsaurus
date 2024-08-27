import { getMonth } from 'date-fns'

export const monthsLongList:monthsLong[] = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const monthsShortList:monthsShort[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// typescript 'overloads': https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads
export function returnMonth (date:Date, config:{returnType: 'long'}):monthsLong
export function returnMonth (date:Date, config:{returnType: 'short'}):monthsShort
export function returnMonth (date:Date, config:{returnType: 'long'|'short'}) {
	const { returnType } = config
	const index = getMonth(date)
	const monthNameLong:monthsLong = monthsLongList[index]
	const monthNameShort:monthsShort = monthsShortList[index]

	if (returnType === 'long') return monthNameLong
	if (returnType === 'short') return monthNameShort
}

export async function to <T,> (promise: Promise<T>) {
	const result:{res: null|Awaited<T>, err: null|Awaited<T>|unknown} = { res: null, err: null }

	try {
		const res = await promise
		result.res = res

		return result
	} catch (err:unknown) {
		result.err = err

		return result
	}
}
