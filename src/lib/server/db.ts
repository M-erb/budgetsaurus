import * as schema from '$lib/server/schema'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { env } from '$env/dynamic/private'

const url = env.TURSO_URL || process.env.TURSO_URL || ''
const authToken = env.TURSO_AUTH || process.env.TURSO_AUTH || ''

const client = createClient({ url, authToken })
export const db = drizzle(client, { schema })
