import 'dotenv/config'
import { faker } from '@faker-js/faker'
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from '../src/lib/server/schema'
import { lastDayOfMonth } from 'date-fns'
import argon2 from '@node-rs/argon2'

const TURSO_URL = process.env.TURSO_URL!
const TURSO_AUTH = process.env.TURSO_AUTH

const client = createClient({ url: TURSO_URL, authToken: TURSO_AUTH })
export const db = drizzle(client, { schema })

async function seed() {
	// Seed users
	const users:Array<typeof schema.users.$inferInsert> = []
	const usersLogins:Array<object> = []
	const usersCount = 3
	for (let i = 0; i < usersCount; i++) {
		const name = i === 0 ? 'admin' : faker.person.fullName()
		const email = i === 0 ? 'admin@test.com' : faker.internet.email()
		const pass = i === 0 ? '1234' : faker.internet.password()

		const newUser = await db.insert(schema.users).values({
			name,
			email,
			pass: await argon2.hash(pass),
			active: i === 0
		}).returning().get()

		usersLogins.push({ name, email, pass })
		users.push(newUser)
	}

	console.log('usersLogins: ', usersLogins)

	// Seed categories
	const categories:Array<typeof schema.cats.$inferInsert> = []
	const categoryNames = ['Groceries', 'Utilities', 'Entertainment', 'Transportation', 'Healthcare', 'Dining Out', 'Shopping', 'Savings', 'Giving']
	const existingCats = await db.query.cats.findMany()
	if (existingCats.length) {
		categories.push(...existingCats)
	} else {
		for (const name of categoryNames) {
			const newCategory = await db.insert(schema.cats).values({
				name,
				note: faker.lorem.sentence(),
				color: faker.color.rgb({ format: 'hex' })
			}).returning().get()
			categories.push(newCategory)
		}
	}

	// Seed share groups
	const shareGroupsData:Array<typeof schema.shareGroups.$inferInsert> = []
	const shareGroupsCount = 2
	for (let i = 0; i < shareGroupsCount; i++) {
		const newShareGroup = await db.insert(schema.shareGroups).values({
			name: `${faker.person.firstName()} ${faker.person.lastName()}`,
			note: faker.lorem.sentence(),
		}).returning().get()
		shareGroupsData.push(newShareGroup)
	}

	// Seed years
	const yearsData:Array<typeof schema.years.$inferInsert> = []
	const yearNamesSrc = ['2023', '2024']
	for (const yearName of yearNamesSrc) {
		try {
			const newYear = await db.insert(schema.years).values({
				name: yearName,
				note: faker.lorem.sentence(),
			}).returning().get()

			yearsData.push(newYear)
		} catch (error) {
			console.error('years insert error.message: ', error.message)
			console.error('years insert error: ', error)

			const existingYear = await db.query.years.findFirst({
				where: ((years, { eq }) => (eq(years.name, yearName)))
			})

			if (existingYear) yearsData.push(existingYear)
		}
	}

	// Seed months
	const monthsData:Array<typeof schema.months.$inferInsert> = []
	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	for (const year of yearsData) {
		for (const monthName of monthNames) {
			const newMonth = await db.insert(schema.months).values({
				yearId: year.id!,
				name: monthName,
				note: faker.lorem.sentence(),
			}).returning().get()
			monthsData.push(newMonth)
		}
	}

	// Seed Incomes
	const incomeNames = ['Pay Check', 'Contacts', 'Misc.']
	for (const month of monthsData) {
		for (const name of incomeNames) {
			if (name === 'Misc.' && faker.number.int({ min: 0, max: 1 })) continue
			await db.insert(schema.incomes).values({
				monthId: month.id!,
				name,
				note: faker.lorem.sentence(),
				planned: faker.number.int({ min: 100000, max: 400000 }),
				amount: faker.number.int({ min: 100000, max: 400000 })
			})
		}
	}

	// Seed budgets
	for (const month of monthsData) {
		for (const category of categories) {
			await db.insert(schema.budgets).values({
				catId: category.id!,
				monthId: month.id!,
				amount: faker.number.int({ min: 10000, max: 100000 })
			})
		}
	}

	// Seed transactions
	const monthsList = await db.query.months.findMany({ with: { year: true } })
	for (const month of monthsList) {
		const transactionCount = faker.number.int({ min: 10, max: 40 })
		for (let i = 0; i < transactionCount; i++) {
			const start = new Date(`${month.year.name}-${month.name}-01`)
			const date = faker.date.between({ from: start, to: lastDayOfMonth(start) })
			const randoCat = faker.helpers.arrayElement(categories)
			const newTransaction = await db.insert(schema.transactions).values({
				monthId: month.id!,
				catId: randoCat.id!,
				name: faker.lorem.words({min: 3, max: 10}),
				note: faker.lorem.sentence(),
				amount: faker.number.int({ min: 100, max: 20000 }), // Amount in cents
				date
			}).returning().get()

			// Seed shareTransactions
			if (randoCat.name === 'Groceries') {
				const randoShareGroup = faker.helpers.arrayElement(shareGroupsData)

				await db.insert(schema.shareTransactions).values({
					shareGroupId: randoShareGroup.id!,
					tranId: newTransaction.id,
					note: faker.lorem.sentence(),
					amount: Math.round(newTransaction.amount/2) // half of transaction amount
				})
			}

			if (randoCat.name === 'Utilities') {
				const randoShareGroup = faker.helpers.arrayElement(shareGroupsData)

				await db.insert(schema.shareTransactions).values({
					shareGroupId: randoShareGroup.id!,
					tranId: newTransaction.id,
					note: faker.lorem.sentence(),
					amount: Math.round(newTransaction.amount/2) // half of transaction amount
				})
			}
		}
	}

	console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
	console.log('Seeding completed successfully!')
	console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
}

seed().catch(console.error)
