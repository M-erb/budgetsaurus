import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { to } from '$lib/lilUtils'
import { db } from '$lib/server/db'
import { incomes } from '@/lib/server/schema'
import { eq } from 'drizzle-orm'
import { verifyUser } from '$lib/server/jwt'
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

	const { res: data, err: jsonErr } = await to(request.json())
	if (jsonErr) {
		console.error('jsonErr: ', jsonErr)
		error(400, 'Bad request')
	}

	const { res: cleanData, err: verifyErr } = await to(verifyPost(data))
	if (verifyErr !== null) error(400, { message: 'missing fields', errors: verifyErr })
	if (cleanData === null) error(500, 'Something went wrong')

	const newIncome = await db
		.insert(incomes)
		.values(cleanData)
		.returning().get()

	return json(newIncome)
}

async function verifyPost (data:unknown) {
	const validation = z.object({
		monthId: z.number(),
		name: z.string(),
		note: z.string(),
		planned: z.number().int().nonnegative(),
		amount: z.number().int().nonnegative()
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

	const newIncome = await db
		.update(incomes)
		.set(cleanData)
		.where(eq(incomes.id, cleanData.id))
		.returning().get()

	return json(newIncome)
}

async function verifyPut (data:unknown) {
	const validation = z.object({
		id: z.number(),
		monthId: z.number(),
		name: z.string(),
		note: z.string(),
		planned: z.number().int().nonnegative(),
		amount: z.number().int().nonnegative()
	})

	const result = validation.parse(data)
	return result
}