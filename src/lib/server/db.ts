import * as schema from '$lib/server/schema'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { TURSO_URL, TURSO_AUTH } from '$env/static/private'

const client = createClient({ url: TURSO_URL, authToken: TURSO_AUTH })
export const db = drizzle(client, { schema })
