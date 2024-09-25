import jwt from '@tsndr/cloudflare-worker-jwt'
import type { JwtPayload, JwtHeader, JwtData } from '@tsndr/cloudflare-worker-jwt'
import { env } from '$env/dynamic/private'
import { db } from '$lib/server/db'
import * as schema from '$lib/server/schema'

interface payloadType extends JwtPayload {
	id: number
}

const JWT_SECRET = env.JWT_SECRET || process.env.JWT_SECRET || ''

export const jwtSign = async (payload: payloadType): Promise<string> => {
	const token = await jwt.sign({
		id: payload.id,
		exp: Math.floor(Date.now() / 1000) + 86400 // 24 hours
	}, JWT_SECRET)

	return token
}

export const verifyUser = async (token: string): Promise<typeof schema.users.$inferInsert | undefined> => {
	const isValid = await jwt.verify(token, JWT_SECRET)
	if (!isValid) throw Error('something went wrong')

	const { payload }: JwtData<JwtPayload, JwtHeader> = await jwt.decode(token)
	if (!payload || !payload.id) throw Error('something went wrong')

	const user = db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, payload.id)
	})

	if (user === undefined) throw Error('no user found')

	return user
}