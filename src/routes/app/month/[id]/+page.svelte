<script lang="ts">
	import type { PageServerData } from './$types'
	import MonthlyReportArea from '$lib/components/monthly-report.svelte'
	import MonthlyTransactions from '$lib/components/monthly-transactions.svelte'
	import MonthlyIncomes from '$lib/components/monthly-incomes.svelte'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import Modal from '$lib/components/modal.svelte'
	import { to, monthsLongList } from '$lib/lilUtils'
	import { invalidateAll } from '$app/navigation'
	import axios from 'redaxios'

	interface Props {
		data: PageServerData
	}

	let { data }: Props = $props()
	let showModal = $state(false)
	let errorBag: errorBagType = {}
	let curTab = $state($page.url.searchParams.get('tab') ?? 'report')

	function tabNav(tabName: string) {
		console.log('tabName: ', tabName)
		$page.url.searchParams.set('tab', tabName)
		const paramsString = $page.url.searchParams.toString()
		curTab = tabName
		goto(`?${paramsString}`)
	}

	onMount(() => {
		if (!$page.url.searchParams.get('tab')) tabNav(curTab)
	})

	let monthName = $state('')

	function editMonthName(name: string) {
		monthName = name
		showModal = true
	}

	async function saveMonthName(e: Event) {
		e.preventDefault()

		const payload = {
			year: {
				id: data.month.yearId
			},
			month: {
				id: data.month.id,
				name: monthName
			}
		}

		const { err } = await to(axios.put('/api/months', payload))
		if (err) console.error('err: ', err)
		if (!err) showModal = false

		await invalidateAll()
	}
</script>

<main>
	<section class="">
		<div class="container">
			<nav class="btn_wrap">
				<a class="btn" href="/app">Back</a>
			</nav>
		</div>
	</section>

	<section class="month_title">
		<div class="container">
			<div class="title_area">
				<h1 class="">
					<span class="fancy_text">{data.month.name}</span> <small>{data.month.year.name}</small>
				</h1>
			</div>

			<nav class="month_nav">
				<button class="btn" onclick={() => tabNav('income')} class:__active={curTab === 'income'}
					>Income</button>
				<button class="btn" onclick={() => tabNav('report')} class:__active={curTab === 'report'}
					>Report</button>
				<button class="btn" onclick={() => tabNav('tran')} class:__active={curTab === 'tran'}
					>Transactions</button>
			</nav>
		</div>
	</section>

	{#if curTab === 'income'}
		<MonthlyIncomes month={data.month} />
	{/if}

	{#if curTab === 'report'}
		<MonthlyReportArea
			monthlyReport={data.monthlyReport}
			incomes={data.month.incomes}
			cats={data.cats} />
	{/if}

	{#if curTab === 'tran'}
		<MonthlyTransactions month={data.month} cats={data.cats} shareGroups={data.shareGroups} />
	{/if}
</main>

<Modal bind:showModal>
	<form onsubmit={saveMonthName}>
		<label class:is_error={errorBag.name}>
			<span class="label">Edit Month</span>
			<!-- svelte-ignore a11y_autofocus -->
			<select bind:value={monthName} autofocus>
				{#each monthsLongList as month}
					<option>{month}</option>
				{/each}
			</select>
		</label>
		<div class="btn_wrap __right">
			<button class="btn" type="submit">Submit</button>
		</div>
	</form>
</Modal>

<style lang="postcss">
	@import '@styles/mediaQueries.pcss';

	.btn_edit_month {
		background-color: transparent;
		border: none;
		border-radius: var(--radius-xl);
		font-size: inherit;
		font-weight: inherit;
		display: inline;
		cursor: pointer;

		&:hover {
			outline: 2px solid var(--color-blue);
		}
	}

	.month_title {
		text-align: center;
	}

	.month_nav {
		margin-top: var(--size-4);

		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--size-4);
		flex-wrap: wrap;

		.btn {
			flex: 0 0 auto;
		}
	}
</style>
