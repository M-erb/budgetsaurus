// import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'

export const load: PageServerLoad = async ({ params }) => {
	console.log('params: ', params)
	const years = await db.query.years.findMany({
		with: {
			months: true
		}
	})

	return {
		years
	}
}
