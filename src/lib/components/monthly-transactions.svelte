<script lang="ts">
	import { centsToDollars } from '$lib/lilUtils'
	import { format as formatDate } from 'date-fns'
	import GroupShare from '$lib/icons/group-share.svelte'

	interface shareItem {
		id: number
		createdAt: Date|null
		note: string|null
		amount: number
		shareGroupId: number
		tranId: number
		shareGroup: {
			id: number
			name: string
			createdAt: Date|null
			note: string|null
		}
	}

	export let month:{
		id: number
		note: string|null
		name: string
		yearId: number
		transactions: {
			id: number
			note: string|null
			date: Date|null
			name: string
			createdAt: Date|null
			catId: number
			monthId: number
			amount: number
			cat: {
				id: number
				name: string
				createdAt: Date|null
				note: string|null
				color: string
			}
			shares: shareItem[]
		}[]
		year: {
			id: number
			name: string
			note: string|null
		}
	}

	function addShares (amount:number, shares:shareItem[]) {
		const sharesAmount = shares.reduce((accum, cur) => (accum += cur.amount), 0)
		return amount - sharesAmount
	}
</script>

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
				<div class="ft_col tran_share"></div>
			</div>

			{#each month.transactions as item}
				{@const amount = addShares(item.amount, item.shares)}
				{@const hasShares = Boolean(item.shares.length)}
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
						<span>{centsToDollars(amount)}</span>
					</div>
					<div class="ft_col tran_share">
						{#if hasShares}
							<GroupShare />
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style lang="postcss">
	@import '@styles/mediaQueries.pcss';

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

			.tran_share {
				flex-basis: 24px;
			}
		}
	}
</style>
