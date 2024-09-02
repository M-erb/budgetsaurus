<script lang="ts">
	import type { PageServerData } from './$types'
	import { centsToDollars, isNegative } from '$lib/lilUtils'
	import ThumbsDown from '@/lib/icons/thumbs-down.svelte'
	import ThumbsUp from '@/lib/icons/thumbs-up.svelte'

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
	<div class="sub_area">
		<h2 class="h4 sec_title">Categories</h2>

		<div class="cat_report">
			{#each data.monthlyReport as cat }
				{@const difference = (cat.budgetAmount ?? 0) - cat.totalAmount}
				{@const isDiffNeg = isNegative(difference)}
				<div class="cat_item">
					<div class="cat_col cat_name">
						<span>{cat.categoryName}</span>
					</div>
					<div class="cat_col cat_num">
						<span>{centsToDollars(cat.totalAmount)}</span>
					</div>
					<div class="cat_col cat_num">
						<span>{centsToDollars(cat.budgetAmount)}</span>
					</div>
					<div class="cat_col cat_num __colors" class:__negative={isDiffNeg}>
						<span>{centsToDollars(difference)}</span>
					</div>
					<div class="cat_col cat_icon __colors" class:__negative={isDiffNeg}>
						{#if isDiffNeg}
							<ThumbsDown />
						{:else}
							<ThumbsUp />
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="container_sm">
	<div class="sub_area">
		<h2 class="h4 sec_title">Transactions</h2>

		<div class="transac_list">
			{#each data.month.transactions as item}
				<div class="transac_item">
					<div class="item_name">
						<span>{item.name}</span>
					</div>
					<div class="item_amount">
						<span>{centsToDollars(item.amount)}</span>
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

	.sub_area {
		max-width: 880px;
		margin-left: auto;
		margin-right: auto;

		.sec_title {
			margin-bottom: var(--size-4);
		}
	}

	.cat_report {
		width: 100%;

		.cat_item {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: var(--size-4);

			.cat_col {
				flex: 1 1 auto;

				&.__colors {
					color: var(--color-green-300);

					&.__negative {
						color: var(--color-red-300);
					}
				}
			}

			.cat_name {
				flex: 1 1 45%;
				font-size: var(--scale-3);
			}

			.cat_num {
				flex: 1 1 20%;
				font-family: var(--font-mono);
				text-align: right;
				font-size: var(--scale-2);
			}

			.cat_icon {
				flex: 1 1 5%;
				text-align: right;
			}
		}
	}
</style>
