import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { to } from '$lib/lilUtils'
import { verifyUser } from '$lib/server/jwt'
import { saveYearMonthDb } from '$lib/server/queries/saveYearMonth'
import { updateMonthName } from '$lib/server/queries/updateMonthName'
import { z } from 'zod'

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

	const { res: data, err: jsonErr }: { res: { year: number, month: string } | null, err: unknown | null } = await to(request.json())
	if (jsonErr) {
		console.error('jsonErr: ', jsonErr)
		error(400, 'Bad request, missing required fields')
	}

	if (!data || !data.year || !data.month) {
		console.error('missing required fields')
		error(400, 'Bad request, missing required fields')
	}

	const res = await saveYearMonthDb(data)

	return json(res)
}

async function verifyPut (data:unknown) {
	const validation = z.object({
		year: z.object({
			id: z.number().gt(0)
		}),
		month: z.object({
			id: z.number().gt(0),
			name: z.enum([
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
			])
		}),
	})

	const result = validation.parse(data)
	return result
}

export const PUT: RequestHandler = async ({ request, cookies }) => {
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

	const { res: cleanData, err: verifyErr } = await to(verifyPut(data))
	if (verifyErr !== null) error(400, { message: 'missing fields', errors: verifyErr })
	if (cleanData === null) error(500, 'Something went wrong')

	const { res, err } = await to(updateMonthName(cleanData))
	// @ts-expect-error err will always have a message prop
	if (err) error(400, err.message)

	return json(res)
}
