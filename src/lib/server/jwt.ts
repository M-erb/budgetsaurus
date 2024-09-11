import jwt from 'jsonwebtoken'
import type { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'
import { db } from '$lib/server/db'
import * as schema from '$lib/server/schema'
// import to from 'await-to-js'

interface payload {
	id: number
}

export const jwtSign = async (payload: payload): Promise<string> => {
	try {
		const token = jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1d' })
		return token
	} catch (e) {
		if (typeof e === 'string') {
			return e.toUpperCase()
		} else if (e instanceof Error) {
			return e.message
		}

		return String(e)
	}
}

export const jwtVerify = async (token: string): Promise<JwtPayload> => {
	try {
		const payload = jwt.verify(token, JWT_SECRET)
		if (typeof payload === 'string') throw 'something went wrong'
		return payload
	} catch (e) {
		if (typeof e === 'string') {
			throw e.toUpperCase()
		} else if (e instanceof Error) {
			throw e.message
		} else throw e
	}
}

export const verifyUser = async (token: string): Promise<typeof schema.users.$inferInsert | undefined> => {
	const jwtPayload = await jwtVerify(token)
	// if (jwtErr instanceof Error) throw jwtErr.message
	if (!jwtPayload || !jwtPayload.id) throw Error('something went wrong')

	const user = db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, jwtPayload.id)
	})

	if (user === undefined) throw Error('no user found')

	return user
}