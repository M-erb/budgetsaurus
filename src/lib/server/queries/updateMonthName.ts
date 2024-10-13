import { to, monthsLongList } from '$lib/lilUtils'
// import { error, json } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { years, months } from '@/lib/server/schema'
import { eq, and } from 'drizzle-orm'

interface input {
	year: {
		id: number
	},
	month: {
		id: number,
		name: monthsLong
	}
}

export async function updateMonthName (inputData: input): Promise<boolean|Error|undefined> {
	// proper month?
	const isProperMonth = monthsLongList.includes(inputData.month.name)
	if (!isProperMonth) return Error('not a proper month name')

	// year exists?
	const {res: yearFromDb, err: errYearFromDb} = await to(db.query.years.findFirst({
		where: eq(years.id, inputData.year.id)
	}))

	if (errYearFromDb || !yearFromDb) {
		if (errYearFromDb) console.error('errYearFromDb: ', errYearFromDb)
		return Error('cannot find year in db')
	}

	// month exists?
	const {res: monthFromDb, err: errMonthFromDb} = await to(db.query.months.findFirst({
		where: eq(months.id, inputData.month.id)
	}))

	if (errMonthFromDb || !monthFromDb) {
		if (errMonthFromDb) console.error('errMonthFromDb: ', errMonthFromDb)
		return Error('cannot find month in db')
	}

	// year does not already have this month name
	const {res: newMonthName, err: errNewMonthName} = await to(db.query.months.findFirst({
		where: and(eq(months.name, inputData.month.name), eq(months.id, inputData.month.id))
	}))

	if (errNewMonthName || newMonthName) {
		if (errNewMonthName) console.error('errNewMonthName: ', errNewMonthName)
		return Error('month name already exists on this year')
	}

	const {err} = await to(db.update(months).set(inputData.month).where(eq(months.id, inputData.month.id)))
	if (err) return Error('error update')

	return true
}
