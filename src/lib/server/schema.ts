import { sql, relations } from 'drizzle-orm'
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

// tables --------------------
export const user = sqliteTable('user', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').notNull(),
	pass: text('pass').notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`)
})

export const cats = sqliteTable('categories', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	note: text('note'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`)
})

export const shareGroups = sqliteTable('shareGroups', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	defaultValue: integer('defaultValue').notNull(),
	note: text('note'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`)
})

export const years = sqliteTable('years', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	note: text('note'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`)
})

export const months = sqliteTable('months', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	yearId: integer('yearId').references(() => years.id).notNull(),
	name: text('name').notNull(),
	note: text('note'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`)
})

export const transactions = sqliteTable('transactions', {
	id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
	monthId: integer('monthId').references(() => months.id).notNull(),
	catId: integer('catId').references(() => cats.id).notNull(),
	name: text('name').notNull(),
	note: text('note'),
	amount: integer('amount', { mode: 'number' }).notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`)
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
	})
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
