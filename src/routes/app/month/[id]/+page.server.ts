import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db'
import { to } from '@/lib/lilUtils'
import { getMonthsCatsTotals } from '$lib/server/queries/getMonthsCatsTotals'

export const load: PageServerLoad = async ({ params }) => {
	console.log('params: ', params)
	const { res: month, err: errMonth } = await to(db.query.months.findFirst({
		where: ((months, { eq }) => eq(months.id, Number(params.id))),
		with: {
			transactions: {
				with: {
					cat: true
				}
			}
		}
	}))

	if (!month) error(404, { message: 'Not Found' })
	if (errMonth) {
		console.error('error query month: ', errMonth)
		error(500, { message: 'something went wrong' })
	}

	const monthsCatsTotals = await getMonthsCatsTotals(month.yearId, month.id)

	return {
		month,
		monthsCatsTotals
	}
}
