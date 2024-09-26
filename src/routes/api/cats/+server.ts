import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { to } from '$lib/lilUtils'
import { db } from '$lib/server/db'
import { cats, budgets } from '@/lib/server/schema'
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

	const budgetData = structuredClone(cleanData.budget)
	const catData = structuredClone(cleanData)
	delete catData.budget

	const newEntry = await db
		.insert(cats)
		.values(catData)
		.returning().get()

	if (!budgetData) return json(newEntry)

	budgetData.catId = newEntry.id
	const newBudget = await db
		.insert(budgets)
		.values(budgetData!)
		.returning().get()

	return json({ ...newEntry, budget: newBudget })
}

async function verifyPost (data:unknown) {
	const validation = z.object({
		name: z.string(),
		note: z.string(),
		color: z.string(),
		budget: z.object({
			monthId: z.number(),
			catId: z.number(),
			amount: z.number().int().nonnegative()
		}).optional()
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

	const budgetData = structuredClone(cleanData.budget)
	const catData = structuredClone(cleanData)
	delete catData.budget

	const updateEntry = await db
		.update(cats)
		.set(catData)
		.where(eq(cats.id, cleanData.id))
		.returning().get()

	if (!budgetData) json(updateEntry)

	const updateBudget = budgetData!.id ?
		await db
			.update(budgets)
			.set(budgetData!)
			.where(eq(budgets.id, budgetData!.id))
			.returning().get()
		:
		await db
			.insert(budgets)
			.values(budgetData!)
			.returning().get()

	return json({ ...updateEntry, budget: updateBudget })
}

async function verifyPut (data:unknown) {
	const validation = z.object({
		id: z.number(),
		name: z.string(),
		note: z.string(),
		color: z.string(),
		budget: z.object({
			id: z.number().optional(),
			monthId: z.number(),
			catId: z.number(),
			amount: z.number().int().nonnegative()
		}).optional()
	})

	const result = validation.parse(data)
	return result
}