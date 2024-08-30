import { sql, relations } from 'drizzle-orm'
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

// tables --------------------
export const users = sqliteTable('users', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').notNull(),
	pass: text('pass').notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(unixepoch())`)
})

export const cats = sqliteTable('categories', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	note: text('note'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(unixepoch())`)
})

export const budgets = sqliteTable('budgets', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	catId: integer('catId').references(() => cats.id).notNull(),
	monthId: integer('monthId').references(() => months.id).notNull(),
	amount: integer('amount', { mode: 'number' }).notNull(), // amount in cents, will convert to dollars as needed to prevent odd floating point inconsistentcies
})

export const shareGroups = sqliteTable('shareGroups', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	defaultValue: integer('defaultValue').notNull(),
	note: text('note'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(unixepoch())`)
})

export const years = sqliteTable('years', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	name: text('name').notNull().unique(),
	note: text('note')
})

export const months = sqliteTable('months', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	yearId: integer('yearId').references(() => years.id).notNull(),
	name: text('name').notNull(),
	note: text('note')
})

export const transactions = sqliteTable('transactions', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	monthId: integer('monthId').references(() => months.id).notNull(),
	catId: integer('catId').references(() => cats.id).notNull(),
	name: text('name').notNull(),
	note: text('note'),
	amount: integer('amount', { mode: 'number' }).notNull(), // amount in cents, will convert to dollars as needed to prevent odd floating point inconsistentcies
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(unixepoch())`)
})

// relations --------------------
export const yearRelations = relations(years, ({ many }) => ({
	months: many(months)
}))

export const monthsRelations = relations(months, ({ many, one }) => ({
	transactions: many(transactions),
	year: one(years, {
		fields: [months.yearId],
		references: [years.id]
	}),
	budgets: many(budgets)
}))

export const transactionRelations = relations(transactions, ({ one }) => ({
	month: one(months, {
		fields: [transactions.monthId],
		references: [months.id],
	}),
	cat: one(cats, {
		fields: [transactions.catId],
		references: [cats.id]
	})
}))

export const catsRelations = relations(cats, ({ many }) => ({
	transactions: many(transactions),
	budgets: many(budgets)
}))

export const budgetRelations = relations(budgets, ({ one }) => ({
	category: one(cats, {
		fields: [budgets.catId],
		references: [cats.id]
	}),
	month: one(months, {
		fields: [budgets.monthId],
		references: [months.id]
	})
}))
