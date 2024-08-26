import 'dotenv/config'
import { migrate } from 'drizzle-orm/libsql/migrator';
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from '../src/lib/server/schema'

const url = process.env.TURSO_URL_PROD!
const authToken = process.env.TURSO_AUTH_PROD

const client = createClient({ url, authToken })
export const db = drizzle(client, { schema })

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: './drizzle/migrations' })

// Don't forget to close the connection, otherwise the script will hang
await client.close()
