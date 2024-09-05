<script lang="ts">
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { centsToDollars, isNegative, numFormat } from '$lib/lilUtils'
	import ThumbsDown from '@/lib/icons/thumbs-down.svelte'
	import ThumbsUp from '@/lib/icons/thumbs-up.svelte'
	import { format as formatDate } from 'date-fns'
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
				data: monthlyReport.map(cat => Number(numFormat(cat.totalAmount! / 100, {style: 'decimal'}))),
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
	<div class="sub_area">
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
					<div class="ft_col cat_num cat_result">
						<span class="label">Spent</span>
						<span>{centsToDollars(totalAmount)}</span>
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

<style lang="postcss">
	@import '@styles/mediaQueries.pcss';

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
</style>