<script lang="ts">
	import type { PageServerData } from './$types'
	import NewMonth from '$lib/components/new-month.svelte'

	export let data:PageServerData
	let isEmpty = !Boolean(data.years.length)
</script>

<section class="container">
	<h1>Welcome to the app!</h1>
	{#if isEmpty}
		<p>Seems there is no data yet, lets get started!</p>
		<NewMonth />
	{:else}
		<div class="content">
			<ul>
				{#each data.years as year}
					<li>
						<p>{year.name}</p>
						<ul>
							{#each year.months as month}
								<li>
									<p><a href="/app/month/{month.id}">{month.name}</a></p>
								</li>
							{/each}
						</ul>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</section>

<!-- <section class="container">
	<p><a href="/app/years">Years</a> - <a href="/app/months">Months</a></p>
</section> -->
