import { sql, relations } from 'drizzle-orm'
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

// tables --------------------
export const users = sqliteTable('users', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	pass: text('pass').notNull(),
	active: integer('active', { mode: 'boolean' }).default(false),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(unixepoch())`)
})

export const cats = sqliteTable('categories', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	note: text('note'),
	color: text('color').notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(unixepoch())`)
})

export const budgets = sqliteTable('budgets', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	catId: integer('catId')
		.references(() => cats.id)
		.notNull(),
	monthId: integer('monthId')
		.references(() => months.id)
		.notNull(),
	amount: integer('amount', { mode: 'number' }).notNull() // amount in cents, will convert to dollars as needed to prevent odd floating point inconsistentcies
})

export const shareGroups = sqliteTable('shareGroups', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
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
	yearId: integer('yearId')
		.references(() => years.id)
		.notNull(),
	name: text('name').notNull(),
	note: text('note')
})

export const incomes = sqliteTable('incomes', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	monthId: integer('monthId')
		.references(() => months.id)
		.notNull(),
	name: text('name').notNull(),
	note: text('note'),
	planned: integer('planned', { mode: 'number' }).notNull(),
	amount: integer('amount', { mode: 'number' }).notNull(),
	date: integer('date', { mode: 'timestamp' }).default(sql`(unixepoch())`),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(unixepoch())`)
})

export const transactions = sqliteTable('transactions', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	monthId: integer('monthId')
		.references(() => months.id)
		.notNull(),
	catId: integer('catId')
		.references(() => cats.id)
		.notNull(),
	name: text('name').notNull(),
	note: text('note'),
	amount: integer('amount', { mode: 'number' }).notNull(), // amount in cents, will convert to dollars as needed to prevent odd floating point inconsistentcies
	date: integer('date', { mode: 'timestamp' }).default(sql`(unixepoch())`),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(unixepoch())`)
})

export const shareTransactions = sqliteTable('shareTransactions', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	shareGroupId: integer('shareGroupId')
		.references(() => shareGroups.id)
		.notNull(),
	tranId: integer('tranId')
		.references(() => transactions.id)
		.notNull(),
	note: text('note'),
	amount: integer('amount', { mode: 'number' }).notNull(), // amount to take away from the transaction it is related with, aka how much it shares with the transaction
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
	budgets: many(budgets),
	incomes: many(incomes)
}))

export const incomeRelations = relations(incomes, ({ one }) => ({
	month: one(months, {
		fields: [incomes.monthId],
		references: [months.id]
	})
}))

export const transactionRelations = relations(transactions, ({ one, many }) => ({
	month: one(months, {
		fields: [transactions.monthId],
		references: [months.id]
	}),
	cat: one(cats, {
		fields: [transactions.catId],
		references: [cats.id]
	}),
	shares: many(shareTransactions)
}))

export const shareTransactionRelations = relations(shareTransactions, ({ one }) => ({
	transaction: one(transactions, {
		fields: [shareTransactions.tranId],
		references: [transactions.id]
	}),
	shareGroup: one(shareGroups, {
		fields: [shareTransactions.shareGroupId],
		references: [shareGroups.id]
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
