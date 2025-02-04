import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

const ENV = process.env.NODE_ENV ?? ''
console.log('ENV: ', ENV)
const TURSO_URL = process.env.TURSO_URL!
const TURSO_URL_PROD = process.env.TURSO_URL_PROD!
const TURSO_AUTH = process.env.TURSO_AUTH
const TURSO_AUTH_PROD = process.env.TURSO_AUTH_PROD

const url = ENV === 'development' ? TURSO_URL : TURSO_URL_PROD
const authToken = ENV === 'development' ? TURSO_AUTH : TURSO_AUTH_PROD

export default defineConfig({
	schema: './src/lib/server/schema.ts',
	out: './drizzle/migrations',
	dialect: 'sqlite', // 'postgresql' | 'mysql' | 'sqlite'
	driver: authToken ? 'turso' : undefined,
	dbCredentials: {
		url,
		authToken
	}
})
