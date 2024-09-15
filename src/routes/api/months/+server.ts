import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { to } from '$lib/lilUtils'
import { db } from '$lib/server/db'
import { years, months } from '@/lib/server/schema'
import { verifyUser } from '$lib/server/jwt'

export const POST: RequestHandler = async ({ request, cookies }) => {
	const token = cookies.get('token')
	if (!token) error(401, 'unauthorized')

	try {
		const user = await verifyUser(token)
		if (!user) error(401, 'unauthorized')
	} catch (err) {
		console.error(err)
		error(401, 'unauthorized')
	}

	const { res: data, err: jsonErr } = await to(request.json())
	if (jsonErr) {
		console.error('jsonErr: ', jsonErr)
		error(400, 'Bad request')
	}

	const res = await saveYearMonthDb(data)

	return json(res)
}

interface returnResult {
	year: typeof years.$inferInsert|undefined
	month: typeof months.$inferInsert|undefined
}

async function saveYearMonthDb ({ year:yearName, month:monthName }:{ year:number, month:string }):Promise<returnResult|undefined> {
	const result:returnResult = {
		year: undefined,
		month: undefined
	}

	// look for if year already exists
	const {res: yearFromDb, err: errYearFromDb} = await to(db.query.years.findFirst({
		where: ((years, {eq}) => eq(years.name, String(yearName)))
	}))

	if (errYearFromDb) console.error('errYearFromDb: ', errYearFromDb)

	if (!yearFromDb) {
		const {res: resNewYear, err: errNewYear} = await to(db.insert(years).values({name: String(yearName), note: ''}).returning())
		if (errNewYear) console.error('errNewYear: ', errNewYear)
		result.year = resNewYear![0]
	} else result.year = yearFromDb

	// look for if month already exists
	const {res: monthFromDb, err: errMonthFromDb} = await to(db.query.months.findFirst({
		where: ((months, {eq, and}) => and(eq(months.name, monthName), eq(months.yearId, result.year!.id!)))
	}))

	if (errMonthFromDb) console.error('errMonthFromDb: ', errMonthFromDb)

	if (!monthFromDb) {
		const { res: resNewMonth, err: errNewMonth } = await to(db.insert(months).values({name: monthName, yearId: result.year!.id!}).returning())
		if (errNewMonth) console.error('errNewMonth: ', errNewMonth)
		result.month = resNewMonth![0]
		return result
	} else {
		result.month = monthFromDb
	}
}
