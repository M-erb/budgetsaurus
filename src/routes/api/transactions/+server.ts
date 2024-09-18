import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { to } from '$lib/lilUtils'
import { db } from '$lib/server/db'
import { transactions, shareTransactions } from '@/lib/server/schema'
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

	const shareData = structuredClone(cleanData.share)
	const transactionData = structuredClone(cleanData)
	delete transactionData.share

	const newEntry: entryType = await db
		.insert(transactions)
		.values(transactionData)
		.returning().get()

	if (!shareData) return json(newEntry)

	const newShare = await db
		.insert(shareTransactions)
		.values(shareData)
		.returning().get()

	newEntry.share = newShare

	return json(newEntry)
}

async function verifyPost (data:unknown) {
	const validation = z.object({
		monthId: z.number(),
		catId: z.number(),
		name: z.string(),
		note: z.string(),
		amount: z.number().int().nonnegative(),
		share: z.object({
			shareGroupId: z.number(),
			tranId: z.number(),
			amount: z.number().int().nonnegative(),
			note: z.string()
		}).optional()
	})

	const result = validation.parse(data)
	return result
}

interface entryType {
	monthId: number
	catId: number
	name: string
	note: string | null
	amount: number
	date: Date | null
	id: number
	createdAt: Date | null,
	share?: {
		note: string | null
		amount: number
		shareGroupId: number
		tranId: number
		id: number
	}
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

	const shareData = structuredClone(cleanData.share)
	const transactionData = structuredClone(cleanData)
	delete transactionData.share

	const updateEntry: entryType = await db
		.update(transactions)
		.set(transactionData)
		.where(eq(transactions.id, cleanData.id))
		.returning().get()

	if (!shareData) return json(updateEntry)

	const updateShare = shareData.id ?
		await db
			.update(shareTransactions)
			.set(shareData)
			.where(eq(shareTransactions.id, shareData.id))
			.returning().get()
		:
		await db
			.insert(shareTransactions)
			.values(shareData)
			.returning().get()

	updateEntry.share = updateShare

	return json(updateEntry)
}

async function verifyPut (data:unknown) {
	const validation = z.object({
		id: z.number(),
		monthId: z.number(),
		catId: z.number(),
		name: z.string(),
		note: z.string(),
		amount: z.number().int().nonnegative(),
		share: z.object({
			id: z.number().optional(),
			shareGroupId: z.number(),
			tranId: z.number(),
			amount: z.number().int().nonnegative(),
			note: z.string()
		}).optional()
	})

	const result = validation.parse(data)
	return result
}