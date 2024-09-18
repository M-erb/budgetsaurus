import { error, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { to } from '$lib/lilUtils'
import { getMonthBudgetReport } from '$lib/server/queries/getMonthReports'
import { verifyUser } from '$lib/server/jwt'

export const load: PageServerLoad = async ({ params, cookies }) => {
	const token = cookies.get('token')
	if (!token) redirect(302, '/login')

	try {
		const user = await verifyUser(token)
		if (!user) redirect(302, '/login')
	} catch (error) {
		console.error(error)
		redirect(302, '/login')
	}

	const { res: month, err: errMonth } = await to(db.query.months.findFirst({
		where: ((months, { eq }) => eq(months.id, Number(params.id))),
		with: {
			year: true,
			transactions: {
				with: {
					cat: true,
					shares: {
						with: {
							shareGroup: true
						}
					}
				},
				orderBy: (transactions, { desc }) => [desc(transactions.date)]
			},
			incomes: {
				with: {
					month: true
				}
			}
		}
	}))

	if (!month) error(404, { message: 'Not Found' })
	if (errMonth) {
		console.error('error query month: ', errMonth)
		error(500, { message: 'something went wrong' })
	}

	const monthlyReport = await getMonthBudgetReport(month.yearId, month.id)

	const cats = await db.query.cats.findMany()
	const shareGroups = await db.query.shareGroups.findMany()

	return {
		month,
		monthlyReport,
		cats,
		shareGroups
	}
}
