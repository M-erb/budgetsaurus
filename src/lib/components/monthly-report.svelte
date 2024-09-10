<script lang="ts">
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { centsToDollars, isNegative, numFormat } from '$lib/lilUtils'
	import ThumbsDown from '$lib/icons/thumbs-down.svelte'
	import ThumbsUp from '$lib/icons/thumbs-up.svelte'
	import Plus from '$lib/icons/plus.svelte'
	import { Chart, DoughnutController, ArcElement, Legend, Tooltip } from 'chart.js'
	import type { ChartType } from 'chart.js'

	export let monthlyReport:{
		yearId: number
		yearName: string
		monthId: number
		monthName: string
		catId: number|null
		catName: string|null
		catColor: string|null
		totalAmount: number
		totalShared: number
		budgetAmount: number|null
	}[]

	export let incomes: {
		date: Date|null
		id: number
		name: string
		createdAt: Date|null
		note: string|null
		monthId: number
		amount: number
		planned: number
		month: {
			id: number
			yearId: number
			name: string
			note: string|null
		}
	}[]

	$:allTotalShared = monthlyReport.reduce((accum, item) => (accum += item.totalShared), 0)
	$:totalBudget = monthlyReport.reduce((accum, item) => (accum += item.budgetAmount ?? 0), 0)
	$:totalSpent = monthlyReport.reduce((accum, item) => (accum += item.totalAmount), 0)
	$:plannedTotalIncomes = incomes.reduce((accum, item) => (accum += item.planned), 0)
	$:amountTotalIncomes = incomes.reduce((accum, item) => (accum += item.amount), 0)

	Chart.register(DoughnutController, ArcElement, Legend, Tooltip)
	Chart.defaults.color = '#fff'
	Chart.overrides.doughnut.plugins.legend.labels = {
		...Chart.overrides.doughnut.plugins.legend.labels,
		usePointStyle: true,
		padding: 20,
		color: '#fff'
	}

	let catChartEl:HTMLCanvasElement
	const chartData = {
		type: 'doughnut' as ChartType,
		data: {
			labels: monthlyReport.map(cat => cat.catName!),
			datasets: [{
				data: monthlyReport.map(cat => Number(numFormat((cat.totalAmount! - cat.totalShared) / 100, {style: 'decimal'}))),
				backgroundColor: monthlyReport.map(cat => cat.catColor!)
			}],
			options: {
				plugins: {
					legend: {
						position: 'chartArea',
						align: 'center',
						display: true,
						labels: {
							usePointStyle: true,
							pointStyle: 'circle',
							padding: 20,
							color: '#fff',
							font: {
								size: 24,
								family: 'var(--font-body)'
							}
						}
					},
					tooltip: {
						bodyColor: 'transparent'
					}
				}
			}
		}
	}

	onMount(() => {
		if (browser) {
			new Chart(catChartEl, chartData)
		}
	})
</script>

<section class="container_sm">
	<div class="sq_report">
		<div class="sq_report_row __top">
			<div class="sq_item">
				<h3 class="label">Planned Income</h3>
				<div class="value_area">
					<span class="value">{centsToDollars(plannedTotalIncomes)}</span>
				</div>
			</div>
			<div
				class="sq_item"
				class:__negative={isNegative(plannedTotalIncomes - totalBudget)}
				class:__positive={!isNegative(plannedTotalIncomes - totalBudget)}>
				<!-- top right -->
				<!-- budget (red if more than planned income)-->
				<h3 class="label">Budget</h3>
				<div class="value_area">
					<span class="value">{centsToDollars(totalBudget)}</span>
				</div>
			</div>
		</div>
		<div class="sq_report_row __bottom">
			<div class="sq_item">
				<h3 class="label">Actual Income</h3>
				<div class="value_area">
					<span class="value">{centsToDollars(amountTotalIncomes)}</span>
				</div>
			</div>
			<div
				class="sq_item"
				class:__negative={isNegative(amountTotalIncomes - totalSpent)}
				class:__positive={!isNegative(amountTotalIncomes - totalSpent)}>
				<!-- bottom right -->
				<!-- spent (red if more than actual income)-->
				<h3 class="label">Spent</h3>
				<div class="value_area">
					<span class="value">{centsToDollars(totalSpent)}</span>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="container_sm">
	<div class="sub_area">
		<div class="sub_head">
			<h2 class="h3">Where spent so far</h2>
		</div>

		<div class="cat_chart">
			<canvas bind:this={catChartEl}></canvas>
		</div>
	</div>
</section>

<section class="container_sm">
	<div class="sub_area">
		<div class="sub_head">
			<h2 class="h3">Categories</h2>
		</div>

		<div class="cat_report flex_table">
			<div class="cat_item ft_row __header">
				<div class="ft_col cat_color"></div>
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

			{#each monthlyReport as cat }
				{@const totalAmount = cat.totalAmount - cat.totalShared ?? 0}
				{@const difference = (cat.budgetAmount ?? 0) - totalAmount}
				{@const isDiffNeg = isNegative(difference)}
				<div class="ft_row cat_item">
					<div class="ft_col cat_color">
						<div class="color_box" style:background-color={cat.catColor}></div>
					</div>
					<div class="ft_col cat_name">
						<span class="label">Name</span>
						<span>{cat.catName}</span>
					</div>
					<div class="ft_col __num cat_result">
						<span class="label">Spent</span>
						<span>{centsToDollars(totalAmount)}</span>
					</div>
					<div class="ft_col __num cat_result">
						<span class="label">Budget</span>
						<span>{centsToDollars(cat.budgetAmount)}</span>
					</div>
					<div class="ft_col __num cat_result __colors" class:__negative={isDiffNeg}>
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

		<div class="btn_wrap __left __t_space">
			<button class="btn"><Plus /><span>Category</span></button>
		</div>
	</div>
</section>

<section class="container_sm">
	<div class="sub_area">
		<div class="title_area">
			<h2 class="h3">Shared Report</h2>
		</div>

		<div class="share_report flex_table">
			<div class="ft_row __header">
				<div class="ft_col __color"></div>
				<div class="ft_col __name"></div>
				<div class="ft_col __result">
					<span class="label">Owes You</span>
				</div>
			</div>

			{#each monthlyReport as cat }
				{@const totalAmount = cat.totalShared ?? 0}
				<div class="ft_row">
					<div class="ft_col __color">
						<div class="color_box" style:background-color={cat.catColor}></div>
					</div>
					<div class="ft_col __name">
						<span class="label">Name</span>
						<span>{cat.catName}</span>
					</div>
					<div class="ft_col __num __result">
						<span class="label">Owes You</span>
						<span>{centsToDollars(totalAmount)}</span>
					</div>
				</div>
			{/each}

			<div class="ft_row">
				<div class="ft_col __color"></div>
				<div class="ft_col __name"></div>
				<div class="ft_col __result">
					<span>Total:</span>
				</div>
				<div class="ft_col __num __result">
					<span class="label">Total</span>
					<span>{centsToDollars(allTotalShared)}</span>
				</div>
			</div>
		</div>
	</div>
</section>

<style lang="postcss">
	@import '@styles/mediaQueries.pcss';

	.sq_report {
		text-align: center;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: stretch;
		gap: var(--size-4);

		.sq_report_row {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: stretch;
			gap: var(--size-4);

			.sq_item {
				background-color: var(--color-grey-800);
				padding: var(--size-8);
				border-radius: var(--radius-xl);
				width: 50%;
				border: 8px solid var(--color-blue-200);

				.label {
					font-size: var(--scale-1);
				}

				.value_area {
					display: flex;
					justify-content: center;
					align-items: center;
					padding: var(--size-4);

					.value {
						font-size: var(--scale-fluid-5);
						font-weight: bold;
						font-family: var(--font-mono);
					}
				}

				&.__negative {
					border-color: var(--color-orange-300);
				}

				&.__positive {
					border-color: var(--color-green-400);

					.value {
						color: var(--color-green-400);
					}
				}
			}
		}
	}

	.cat_chart {
		margin-bottom: var(--size-8);
	}

	.color_box {
		width: 24px;
		height: 24px;
		border-radius: var(--radius-full);
	}

	.__num {
		font-family: var(--font-mono);
		font-size: var(--scale-2);
	}

	.cat_report {
		.cat_item {
			.ft_col {
				&.__colors {
					color: var(--color-green-300);

					&.__negative {
						color: var(--color-red-300);
					}
				}
			}

			.cat_color {
				flex-basis: 3%;
			}

			.cat_name {
				flex-basis: 45%;
				font-size: var(--scale-3);
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

	.share_report {
		.ft_row {
			.cat_color {
				flex-basis: 3%;
			}

			.__name {
				flex-basis: 70%;
				font-size: var(--scale-3);
			}

			.__result {
				flex-basis: 20%;
				text-align: right;
			}
		}
	}
</style>