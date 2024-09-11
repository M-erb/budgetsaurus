import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { verifyUser } from '$lib/server/jwt'
import { db } from '$lib/server/db'

export const load: PageServerLoad = async ({cookies}) => {
	const token = cookies.get('token')
	if (!token) redirect(302, '/login')

	try {
		const user = await verifyUser(token)
		if (!user) redirect(302, '/login')
	} catch (error) {
		console.error(error)
		redirect(302, '/login')
	}

	const years = await db.query.years.findMany({
		with: {
			months: true
		}
	})

	return {
		years
	}
}
