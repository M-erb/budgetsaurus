<script lang="ts">
	import { centsToDollars, fillErrorBag } from '$lib/lilUtils'
	import { format as formatDate } from 'date-fns'
	import GroupShare from '$lib/icons/group-share.svelte'
	import Plus from '$lib/icons/plus.svelte'
	import Modal from './modal.svelte'
	import CentsToDollarsField from '$lib/components/cents-to-dollars-field.svelte'
	import axios from 'redaxios'
	import { invalidateAll } from '$app/navigation'
	import { to } from '$lib/lilUtils'
	import SelectCatField from '$lib/components/select-cat-field.svelte'
	import AddShare from '$lib/components/add-share.svelte'

	export let month:{
		id: number
		note: string|null
		name: string
		yearId: number
		transactions: transaction[]
		year: {
			id: number
			name: string
			note: string|null
		}
	}

	export let cats: cat[]

	export let shareGroups: {
		id: number
		name: string
		createdAt: Date|null
		note: string|null
	}[]

	let showModal = false
	let modalMode: 'addNew'|'edit'|null = null
	let errorBag: errorBagType = {}

	const addNewFields: newFieldsType = {
		monthId: month.id,
		catId: 0,
		name: '',
		amount: 0,
		note: ''
	}

	const editFields: editFieldsType = {
		id: 0,
		monthId: 0,
		catId: 0,
		name: '',
		note: '',
		amount: 0
	}

	function startAddNew () {
		errorBag = {}
		delete addNewFields.share
		addNewFields.monthId = month.id
		addNewFields.catId = 0
		addNewFields.name = ''
		addNewFields.amount = 0
		addNewFields.note = ''

		showModal = true
		modalMode = 'addNew'
	}

	function startEditEntry (entry:transaction) {
		errorBag = {}
		delete editFields.share
		editFields.id = entry.id
		editFields.monthId = entry.monthId
		editFields.catId = entry.catId
		editFields.name = entry.name
		editFields.note = entry.note
		editFields.amount = entry.amount

		if (entry.shares.length) {
			const share = entry.shares[0]
			editFields.share = {
				id: share.id,
				tranId: share.tranId,
				shareGroupId: share.shareGroupId,
				amount: share.amount,
				note: share.note,
				createdAt: share.createdAt
			}
		}

		modalMode = 'edit'
		showModal = true
	}

	async function saveNew () {
		const { err }: { err: any, res: any} = await to(axios.post('/api/transactions', addNewFields))
		if (err) console.error('err: ', err)
		if (!err) showModal = false

		const data: apiErr = err.data

		if (data.errors.issues.length) errorBag = fillErrorBag(data.errors.issues)

		await invalidateAll()
	}

	async function saveEdit () {
		const {err} = await to(axios.put('/api/transactions', editFields))
		if (err) console.error('err: ', err)
		if (!err) showModal = false

		await invalidateAll()
	}

	function combineShares (amount:number, shares:shareItem[]) {
		const sharesAmount = shares.reduce((accum, cur) => (accum += cur.amount), 0)
		return amount - sharesAmount
	}
</script>

<section class="container_sm">
	<div class="sub_area">
		<div class="sub_head">
			<h2 class="h4 sec_title">Transactions</h2>
			<div class="btn_wrap">
				<button class="btn_round" on:click={startAddNew}><Plus /></button>
			</div>
		</div>
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
				{@const amount = combineShares(item.amount, item.shares)}
				{@const hasShares = Boolean(item.shares.length)}
				<button class="ft_row" on:click={() => startEditEntry(item)} title="Edit Income">
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
				</button>
			{/each}
		</div>

		<div class="btn_wrap __left __t_space">
			<button class="btn" on:click={startAddNew}><Plus /><span>Transaction</span></button>
		</div>
	</div>
</section>

<Modal bind:showModal on:close={() => modalMode = null}>
	{#if modalMode === 'addNew'}
		<h2 class="h5">New Transaction</h2>

		<form on:submit|preventDefault={saveNew}>
			<label class:is_error={errorBag.name}>
				<span class="label">Name</span>
				<!-- svelte-ignore a11y-autofocus -->
				<input type="text" bind:value={addNewFields.name} autofocus>
				{#if errorBag.name}
					<div class="error_space">
						<p>{errorBag.name}</p>
					</div>
				{/if}
			</label>
			<CentsToDollarsField
				label=Amount
				bind:value={addNewFields.amount}
			/>
			<SelectCatField bind:value={addNewFields.catId} cats={cats} />
			<AddShare bind:value={addNewFields.share} amount={addNewFields.amount} tranId={0} shareGroups={shareGroups} />
			<label>
				<span class="label">Note</span>
				<textarea bind:value={addNewFields.note}></textarea>
			</label>
			<div class="btn_wrap __right">
				<button class="btn" type="submit">Submit</button>
			</div>
		</form>
	{/if}

	{#if modalMode === 'edit'}
		<h2 class="h5">Edit Transaction</h2>

		<form on:submit|preventDefault={saveEdit}>
			<label>
				<span class="label">Name</span>
				<!-- svelte-ignore a11y-autofocus -->
				<input type="text" bind:value={editFields.name} autofocus>
			</label>
			<CentsToDollarsField
				label=Amount
				bind:value={editFields.amount}
			/>
			<SelectCatField bind:value={editFields.catId} cats={cats} />
			<AddShare bind:value={editFields.share} amount={editFields.amount} tranId={editFields.id} shareGroups={shareGroups} />
			<label>
				<span class="label">Note</span>
				<textarea bind:value={editFields.note}></textarea>
			</label>
			<div class="btn_wrap __right">
				<button class="btn" type="submit">Submit</button>
			</div>
		</form>
	{/if}
</Modal>

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
				flex-basis: 17%;
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

<script lang=ts context=module>
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

	interface transaction {
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
	}

	interface cat {
		id: number
		note: string|null
		createdAt: Date|null
		color: string
		name: string
	}

	interface newFieldsType {
		monthId: number
		catId: number
		name: string
		note: string|null
		amount: number
		share?: {
			tranId: number
			shareGroupId: number
			amount: number
			note: string|null
		}
	}

	interface editFieldsType {
		id: number
		monthId: number
		catId: number
		name: string
		note: string|null
		amount: number
		share?: {
			tranId: number
			shareGroupId: number
			id: number
			amount: number
			note: string|null
			createdAt: Date|null
		}
	}
</script>