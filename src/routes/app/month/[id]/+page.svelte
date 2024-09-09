<script lang="ts">
	import type { PageServerData } from './$types'
	import MonthlyReportArea from '$lib/components/monthly-report.svelte'
	import MonthlyTransactions from '$lib/components/monthly-transactions.svelte'
	import MonthlyIncomes from '$lib/components/monthly-incomes.svelte'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'

	export let data:PageServerData
	let curTab = $page.url.searchParams.get('tab') ?? 'report'

	function tabNav (tabName:string) {
		$page.url.searchParams.set('tab', tabName)
		const paramsString = $page.url.searchParams.toString()
		curTab = tabName
		goto(`?${paramsString}`)
	}

	onMount(() => {
		if (!$page.url.searchParams.get('tab')) tabNav(curTab)
	})
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
				<h1 class=""><span class="fancy_text">{data.month.name}</span> <small>{data.month.year.name}</small></h1>
			</div>
	
			<nav class="month_nav">
				<button class="btn" on:click={() => tabNav('income')} class:__active={curTab === 'income'}>Income</button>
				<button class="btn" on:click={() => tabNav('report')} class:__active={curTab === 'report'}>Report</button>
				<button class="btn" on:click={() => tabNav('tran')} class:__active={curTab === 'tran'}>Transactions</button>
			</nav>
		</div>
	</section>

	{#if curTab === 'income' }
		<MonthlyIncomes month={data.month} />
	{/if}

	{#if curTab === 'report' }
		<MonthlyReportArea monthlyReport={data.monthlyReport} />
	{/if}

	{#if curTab === 'tran' }
		<MonthlyTransactions month={data.month} />
	{/if}
</main>

<style lang="postcss">
	@import '@styles/mediaQueries.pcss';

	.month_title {
		text-align: center;
	}

	.month_nav {
		margin-top: var(--size-4);

		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--size-4);

		.btn {
			flex: 0 0 auto;
		}
	}
</style>
