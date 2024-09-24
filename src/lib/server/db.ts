import * as schema from '$lib/server/schema'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { env } from '$env/dynamic/private'

const client = createClient({ url: env.TURSO_URL, authToken: env.TURSO_AUTH })
export const db = drizzle(client, { schema })
