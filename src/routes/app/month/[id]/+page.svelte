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
	<div class="cats_report sub_area">
		<h2 class="h4 sec_title">Categories</h2>

		<table class="cat_report">
			<colgroup>
				<col span="1" style="width: 45%">
				<col span="1" style="width: 15%">
				<col span="1" style="width: 15%">
				<col span="1" style="width: 20%">
				<col span="1" style="width: 5%">
			</colgroup>
			<thead>
				<tr>
					<td><div class="cat_label">Name</div></td>
					<td><div class="cat_total">Spent</div></td>
					<td><div class="cat_budget">Budget</div></td>
					<td><div class="cat_result">Remaining</div></td>
					<td></td>
				</tr>
			</thead>
			<tbody>
				{#each data.monthlyReport as cat }
					{@const difference = (cat.budgetAmount ?? 0) - cat.totalAmount}
					{@const isDiffNeg = isNegative(difference)}
					<tr>
						<td>
							<div class="cat_label">
								<span>{cat.categoryName}</span>
							</div>
						</td>
						<td>
							<div class="cat_total">
								<span>{centsToDollars(cat.totalAmount)}</span>
							</div>
						</td>
						<td>
							<div class="cat_budget">
								<span>{centsToDollars(cat.budgetAmount)}</span>
							</div>
						</td>
						<td>
							<div class="cat_result" class:__negative={isDiffNeg}>
								<span>{centsToDollars(difference)}</span>
							</div>
						</td>
						<td>
							<div class="cat_icon" class:__negative={isDiffNeg}>
								{#if isDiffNeg}
									<ThumbsDown />
								{:else}
									<ThumbsUp />
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
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

	.cat_report {
		width: 100%;

		thead {
			td {
				.cat_label {
					font-size: var(--scale-2);
				}

				.cat_total, .cat_budget, .cat_result {
					text-align: right;
					font-size: var(--scale-2);
				}
			}
		}

		tbody {
			td {
				.cat_label {
					font-size: var(--scale-3);
				}

				.cat_total, .cat_budget, .cat_result {
					text-align: right;
					font-family: var(--font-mono);
					font-size: var(--scale-2);
				}

				.cat_icon {
					text-align: right;
					position: relative;
					bottom: -6px;
				}

				.cat_result, .cat_icon {
					color: var(--color-green-300);

					&.__negative {
						color: var(--color-red-300);
					}
				}

			}
		}
	}
</style>
