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

		<div class="cat_report flex_table">
			<div class="cat_item ft_row __header">
				<div class="ft_col cat_name"></div>
				<div class="ft_col cat_result">
					<span class="label">Spent</span>
				</div>
				<div class="ft_col cat_result">
					<span class="label">Budget</span>
				</div>
				<div class="ft_col cat_result">
					<span class="label">Remaining</span>
				</div>
				<div class="ft_col cat_icon"></div>
			</div>

			{#each data.monthlyReport as cat }
				{@const difference = (cat.budgetAmount ?? 0) - cat.totalAmount}
				{@const isDiffNeg = isNegative(difference)}
				<div class="ft_row cat_item">
					<div class="ft_col cat_name">
						<span class="label">Name</span>
						<span>{cat.categoryName}</span>
					</div>
					<div class="ft_col cat_num cat_result">
						<span class="label">Spent</span>
						<span>{centsToDollars(cat.totalAmount)}</span>
					</div>
					<div class="ft_col cat_num cat_result">
						<span class="label">Budget</span>
						<span>{centsToDollars(cat.budgetAmount)}</span>
					</div>
					<div class="ft_col cat_num cat_result __colors" class:__negative={isDiffNeg}>
						<span class="label">Remaining</span>
						<span>{centsToDollars(difference)}</span>
					</div>
					<div class="ft_col cat_icon __colors" class:__negative={isDiffNeg}>
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
	@import '@styles/mediaQueries.pcss';

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
			.ft_col {
				&.__colors {
					color: var(--color-green-300);

					&.__negative {
						color: var(--color-red-300);
					}
				}
			}

			.cat_name {
				flex-basis: 45%;
				font-size: var(--scale-3);
			}

			.cat_num {
				font-family: var(--font-mono);
				font-size: var(--scale-2);
			}

			.cat_result {
				flex-basis: 15%;
				text-align: right;
			}

			.cat_icon {
				flex-basis: 5%;
				text-align: right;
			}
		}
	}
</style>
