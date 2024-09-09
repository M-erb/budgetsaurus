<script lang="ts">
	import { centsToDollars, isNegative } from '$lib/lilUtils'
	import { format as formatDate } from 'date-fns'
	import GroupShare from '$lib/icons/group-share.svelte'
	import Plus from '$lib/icons/plus.svelte'
	import ThumbsDown from '$lib/icons/thumbs-down.svelte'
	import ThumbsUp from '$lib/icons/thumbs-up.svelte'

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
		incomes: {
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
		<div class="sub_head">
			<h2 class="h4 sec_title">Income</h2>
			<div class="btn_wrap">
				<button class="btn_round"><Plus /></button>
			</div>
		</div>
		<div class="flex_table tran_list">

			<div class="ft_row __header">
				<div class="ft_col __name"></div>
				<div class="ft_col __amount">
					<span class="label">Planned</span>
				</div>
				<div class="ft_col __amount">
					<span class="label">Actual</span>
				</div>
				<div class="ft_col __icon"></div>
			</div>

			{#each month.incomes as item}
				{@const difference = item.amount - item.planned}
				{@const isDiffNeg = isNegative(difference)}
				<div class="ft_row">
					<div class="ft_col __name">
						<span>{item.name}</span>
					</div>
					<div class="ft_col __amount __num">
						<span class="label">Planned</span>
						<span>{centsToDollars(item.planned)}</span>
					</div>
					<div class="ft_col __amount __num">
						<span class="label">Actual</span>
						<span>{centsToDollars(item.amount)}</span>
					</div>
					<div class="ft_col __icon" class:__negative={isDiffNeg}>
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
			<button class="btn"><Plus /><span>Transaction</span></button>
		</div>
	</div>
</section>

<style lang="postcss">
	@import '@styles/mediaQueries.pcss';

	.sub_head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--size-4);
		flex-wrap: wrap;
	}

	.tran_list {
		.ft_row {
			.__name {
				flex-basis: 60%;
				font-size: var(--scale-2);
			}

			.__icon {
				flex-basis: 24px;
			}

			.__amount {
				flex-basis: 18%;
				text-align: right;
			}

			.__num {
				font-family: var(--font-mono);
				font-size: var(--scale-2);
			}
		}
	}
</style>
