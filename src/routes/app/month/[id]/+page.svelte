<script lang="ts">
	import type { PageServerData } from './$types'
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { centsToDollars, isNegative, numFormat } from '$lib/lilUtils'
	import ThumbsDown from '@/lib/icons/thumbs-down.svelte'
	import ThumbsUp from '@/lib/icons/thumbs-up.svelte'
	import { format as formatDate } from 'date-fns'
	import { Chart, DoughnutController, ArcElement, Legend, Tooltip } from 'chart.js'
	import type { ChartType } from 'chart.js'

	Chart.register(DoughnutController, ArcElement, Legend, Tooltip)
	Chart.defaults.color = '#fff'
	Chart.overrides.doughnut.plugins.legend.labels = {
		...Chart.overrides.doughnut.plugins.legend.labels,
		usePointStyle: true,
		padding: 20,
		color: '#fff'
	}

	export let data:PageServerData

	let catChartEl:HTMLCanvasElement
	const chartData = {
		type: 'doughnut' as ChartType,
		data: {
			labels: data.monthlyReport.map(cat => cat.catName!),
			datasets: [{
				data: data.monthlyReport.map(cat => Number(numFormat(cat.totalAmount! / 100, {style: 'decimal'}))),
				backgroundColor: data.monthlyReport.map(cat => cat.catColor!)
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
		<!-- <h2 class="h4 sec_title">Categories</h2> -->

		<div class="cat_chart">
			<canvas bind:this={catChartEl}></canvas>
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

			{#each data.monthlyReport as cat }
				{@const difference = (cat.budgetAmount ?? 0) - cat.totalAmount}
				{@const isDiffNeg = isNegative(difference)}
				<div class="ft_row cat_item">
					<div class="ft_col cat_color">
						<div class="color_box" style:background-color={cat.catColor}></div>
					</div>
					<div class="ft_col cat_name">
						<span class="label">Name</span>
						<span>{cat.catName}</span>
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

		<div class="flex_table tran_list">
			<div class="ft_row __header">
				<div class="ft_col tran_color"></div>
				<div class="ft_col tran_cat">
					<span class="label">Category</span>
				</div>
				<div class="ft_col tran_name"></div>
				<div class="ft_col tran_amount">
					<span class="label">Amount</span>
				</div>
			</div>
			{#each data.month.transactions as item}
				<div class="ft_row">
					<div class="ft_col tran_color">
						<div class="color_box" style:background-color={item.cat.color}></div>
					</div>
					<div class="ft_col tran_cat">
						<span>{item.cat.name}</span>
					</div>
					<div class="ft_col tran_name">
						<span>{item.name}</span>
					</div>
					<div class="ft_col tran_date">
						<span>{formatDate(item.date ?? '', 'MMM dd')}</span>
					</div>
					<div class="ft_col tran_amount tran_num">
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

	.cat_chart {
		margin-bottom: var(--size-8);
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

				.color_box {
					width: 24px;
					height: 24px;
					border-radius: var(--radius-full);
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

	.tran_list {
		.ft_row {
			.tran_color {
				flex-basis: 3%;

				.color_box {
					width: 24px;
					height: 24px;
					border-radius: var(--radius-full);
				}
			}

			.tran_name {
				flex-basis: 60%;
			}

			.tran_amount {
				flex-basis: 15%;
				text-align: right;
			}

			.tran_date {
				flex-basis: 8%;
			}

			.tran_cat {
				flex-basis: 14%;
			}

			.tran_num {
				font-family: var(--font-mono);
				font-size: var(--scale-2);
			}
		}
	}
</style>
