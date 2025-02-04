import type { LayoutServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { verifyUser } from '$lib/server/jwt'

export const load: LayoutServerLoad = async ({ cookies }) => {
	const token = cookies.get('token')
	if (!token) redirect(302, '/login')

	try {
		const user = await verifyUser(token)
		if (!user) redirect(302, '/login')

		const cleaned: {
			name: string
			email: string
			pass?: string
			id?: number | undefined
			active?: boolean | null | undefined
			createdAt?: Date | null | undefined
		} = structuredClone(user)

		delete cleaned.pass

		return {
			user: cleaned
		}
	} catch (error) {
		console.error(error)
		redirect(302, '/login')
	}
}
