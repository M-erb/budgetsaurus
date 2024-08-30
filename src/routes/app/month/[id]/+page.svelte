<script lang="ts">
	import type { PageServerData } from './$types'
	import { centsToDollars } from '$lib/lilUtils'

	export let data:PageServerData
</script>

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
	</div>
</section>

<section class="container_sm">
	<div class="cats_report sub_area">
		<h2 class="h4 sec_title">Categories</h2>
		<div class="cats_list">
			<div class="cat_item __header">
				<div class="cat_label">
					<span>Name</span>
				</div>
				<div class="cat_total">
					<span>Spent</span>
				</div>
				<div class="cat_budget">
					<span>Budget</span>
				</div>
			</div>
			{#each data.monthlyReport as cat }
				<div class="cat_item">
					<div class="cat_label">
						<span>{cat.categoryName}</span>
					</div>
					<div class="cat_total">
						<span>{centsToDollars(cat.totalAmount)}</span>
					</div>
					<div class="cat_budget">
						<span>{centsToDollars(cat.budgetAmount)}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="postcss">
	.month_title {
		text-align: center;
	}

	.cats_report {
		max-width: 880px;
		margin-left: auto;
		margin-right: auto;

		.sec_title {
			margin-bottom: var(--size-4);
		}
	}

	/* TODO: change this to a table, it just makes sense */
	.cats_list {
		.cat_item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: var(--size-4);
			padding: var(--size-1) 0;

			.cat_label {
				flex: 1 1 80px;
				font-size: var(--scale-3);
			}

			.cat_total {
				flex: 1 1 50px;
				text-align: right;
				font-family: var(--font-mono);
				font-size: var(--scale-2);
			}

			.cat_budget {
				flex: 1 1 auto;
				text-align: right;
				font-family: var(--font-mono);
				font-size: var(--scale-2);
			}
		}
	}
</style>
