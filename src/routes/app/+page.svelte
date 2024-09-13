<script lang="ts">
	import type { PageServerData } from './$types'
	import AddNewMonth from '@/lib/components/add-new-month.svelte'
	import Plus from '$lib/icons/plus.svelte'
	import Modal from '$lib/components/modal.svelte'

	export let data:PageServerData
	const today = new Date()
	let isEmpty = !Boolean(data.years.length)

	// figure out what the appropriate next year is
	let nextYearFromDb = isEmpty ? 0 : Number(data.years.at(-1)?.name) + 1
	let nextYearFromToday = today.getFullYear() + 1
	let nextYear = nextYearFromDb > nextYearFromToday ? nextYearFromDb : nextYearFromToday

	let actionType: 'addMonth'|'addYear'|''
	let showModal: boolean

	function openAddMonth () {
		actionType = 'addMonth'
		showModal = true
	}

	function openAddYear () {
		actionType = 'addYear'
		showModal = true
	}
</script>

<section class="container">
	<h1>Budgetsaurus</h1>
	{#if isEmpty}
		<p>Seems there is no data yet, lets get started!</p>
		<AddNewMonth />
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
								<button class="btn" on:click|preventDefault={openAddMonth}><Plus /><span>Next Month</span></button>
							</li>
						{/if}
					</ul>
				</li>
			{/each}
			<li class="item">
				<button class="btn" on:click|preventDefault={openAddYear}><Plus /><span>Start {nextYear}</span></button>
			</li>
		</ul>
	{/if}
</section>

<Modal bind:showModal on:close={() => actionType = ''}>
	{#if actionType === 'addMonth'}
		<AddNewMonth />
	{/if}

	{#if actionType === 'addYear'}
		<p>add a new year</p>
	{/if}
</Modal>

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
