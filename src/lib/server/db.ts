import * as schema from '$lib/server/schema'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { env } from '$env/dynamic/private'

const url = env.TURSO_URL || process.env.TURSO_URL || ':memory:'
const authToken = env.TURSO_AUTH || process.env.TURSO_AUTH || ''

if (url === ':memory:') console.log('DB in-memory mode')

const client = createClient({ url, authToken })
export const db = drizzle(client, { schema })
