import type { Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import { db } from '$lib/server/db'
import { jwtSign } from '$lib/server/jwt'
import { compare } from 'bcrypt-ts'

export const actions = {
	login: async ({request, cookies}) => {
		const data = await request.formData()
		const email = data.get('email')
		const pass = data.get('pass')

		if (!email) return fail(400, {
			success: false,
			email,
			missing: true,
			message: 'Email is missing'
		})

		if (!pass) return fail(400, {
			success: false,
			pass,
			missing: true,
			message: 'Password is missing'
		})

		const user = await db.query.users.findFirst({
			where: ((users, { eq }) => eq(users.email, String(email)))
		})

		const isGood = user ? await compare(String(pass), user.pass) : false

		if (!user || !isGood) return fail(400, {
			success: false,
			message: 'Incorrect email or password'
		})

		// issue signed JWT as a cookie
		const token = await jwtSign({ id: user.id })
		cookies.set('token', String(token), { path: '/' })

		redirect(300, '/app')
	}
} satisfies Actions