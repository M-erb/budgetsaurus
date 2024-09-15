<script lang="ts">
	import type { PageServerData } from './$types'
	import AddNewMonth from '@/lib/components/add-new-month.svelte'
	import Plus from '$lib/icons/plus.svelte'
	import { invalidateAll } from '$app/navigation'
	import axios from 'redaxios'
	import { to, monthsLongList } from '$lib/lilUtils'

	export let data:PageServerData
	const today = new Date()
	let isEmpty = !Boolean(data.years.length)

	// figure out what the appropriate next year is
	let nextYearFromToday = today.getFullYear() + 1
	let nextYearFromDb: number
	let nextYear: number

	$: nextYearFromDb = isEmpty ? 0 : Number(data.years.at(-1)?.name) + 1
	$: nextYear = nextYearFromDb > nextYearFromToday ? nextYearFromDb : nextYearFromToday

	async function addMonth (yearName: string, monthCount: number) {
		if (monthCount >= 12) return

		const fields = {
			year: yearName,
			month: monthsLongList[monthCount]
		}

		const {res, err} = await to(axios.post('/api/months', fields))
		if (err) console.error('addMonth err: ', err)

		reloadData()
	}

	async function addYear (year: number) {
		const fields = {
			year: String(year),
			month: monthsLongList[0]
		}

		const {res, err} = await to(axios.post('/api/months', fields))
		if (err) console.error('addYear err: ', err)

		reloadData()
	}

	function reloadData () {
		invalidateAll()
	}
</script>

<section class="container">
	<h1>Budgetsaurus</h1>
	{#if isEmpty}
		<p>Seems there is no data yet, lets get started!</p>
		<AddNewMonth on:finished={reloadData} />
	{:else}
		<ul class="years_list">
			{#each data.years as year}
				<li class="item">
					<h2 class="h5 year_label"><span class="fancy_text">{year.name}</span></h2>
					<ul class="months">
						{#each year.months as month}
							<li class="month">
								<a href="/app/month/{month.id}"><span class="label">{month.name}</span></a>
							</li>
						{/each}
						{#if year.months.length < 12}
							<li class="add_btn">
								<button class="btn" on:click|preventDefault={() => addMonth(year.name, year.months.length)}><Plus /><span>Next Month</span></button>
							</li>
						{/if}
					</ul>
				</li>
			{/each}
			<li class="item">
				<button class="btn" on:click|preventDefault={() => addYear(nextYear)}><Plus /><span>Start {nextYear}</span></button>
			</li>
		</ul>
	{/if}
</section>

<style lang="postcss">
	@import '@styles/mediaQueries.pcss';

	.years_list {
		.item {
			margin-bottom: var(--size-6);

			.year_label {
				margin-bottom: var(--size-2);
			}

			.months {
				display: flex;
				justify-content: flex-start;
				align-items: stretch;
				flex-wrap: wrap;
				gap: var(--size-2);

				.month a {
					display: block;
					background-color: var(--color-slate-700);
					border-radius: var(--radius-sm);
					padding: var(--size-2) var(--size-4);
					text-decoration: none;
					border: 2px solid var(--color-slate-700);
					transition: border-color .3s ease-in-out;

					&:hover {
						border-color: var(--color-blue-200);
					}
				}

				.add_btn {
					display: flex;
					justify-content: flex-start;
					align-items: stretch;

					.btn {
						min-width: auto;
					}
				}
			}
		}
	}
</style>
