import { eq, and, sql } from 'drizzle-orm'
import { months, transactions, cats, years } from '$lib/server/schema'
import { db } from '$lib/server/db'

export const getMonthsCatsTotals = async (yearId: number, monthId: number) => {
	const result = await db
		.select({
			yearId: years.id,
			yearName: years.name,
			monthId: months.id,
			monthName: months.name,
			categoryId: cats.id,
			categoryName: cats.name,
			totalAmount: sql<number>`CAST(SUM(${transactions.amount}) AS DECIMAL(10, 2))`,
		})
		.from(months)
		.innerJoin(years, eq(months.yearId, years.id))
		.leftJoin(transactions, eq(transactions.monthId, months.id))
		.leftJoin(cats, eq(transactions.catId, cats.id))
		.where(
			and(
				eq(years.id, yearId),
				eq(months.id, monthId)
			)
		)
		.groupBy(years.id, years.name, months.id, months.name, cats.id, cats.name)
		.orderBy(cats.id)

	return result
}
