<script lang="ts">
	import type { PageServerData } from './$types'
	import NewMonth from '$lib/components/new-month.svelte'

	export let data:PageServerData
	let isEmpty = !Boolean(data.years.length)
</script>

<section class="container">
	<h1>Budgetsaurus</h1>
	{#if isEmpty}
		<p>Seems there is no data yet, lets get started!</p>
		<NewMonth />
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
					</ul>
				</li>
			{/each}
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
				align-items: flex-start;
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
			}
		}
	}
</style>
