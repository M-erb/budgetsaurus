<script lang="ts" module>
	interface props {
		month: {
			id: number
			note: string | null
			name: string
			yearId: number
			transactions: transaction[]
			year: {
				id: number
				name: string
				note: string | null
			}
		}
		cats: cat[]
		shareGroups: {
			id: number
			name: string
			createdAt: Date | null
			note: string | null
		}[]
	}

	interface shareItem {
		id: number
		createdAt: Date | null
		note: string | null
		amount: number
		shareGroupId: number
		tranId: number
		shareGroup: {
			id: number
			name: string
			createdAt: Date | null
			note: string | null
		}
	}

	interface transaction {
		id: number
		note: string | null
		date: Date | null
		name: string
		createdAt: Date | null
		catId: number
		monthId: number
		amount: number
		cat: {
			id: number
			name: string
			createdAt: Date | null
			note: string | null
			color: string
		}
		shares: shareItem[]
	}

	interface cat {
		id: number
		note: string | null
		createdAt: Date | null
		color: string
		name: string
	}

	interface newFieldsType {
		monthId: number
		name: string
		amount: number
		note: string | null
		catId: number
		share?: {
			tranId: number
			shareGroupId: number
			amount: number
			note: string | null
		}
	}

	interface editFieldsType {
		id: number
		monthId: number
		catId: number
		name: string
		note: string | null
		amount: number
		share?: {
			tranId: number
			shareGroupId: number
			id: number
			amount: number
			note: string | null
			createdAt: Date | null
		}
	}
</script>

<script lang="ts">
	import { centsToDollars, fillErrorBag } from '$lib/lilUtils'
	import { format as formatDate } from 'date-fns'
	import GroupShare from '$lib/icons/group-share.svelte'
	import Plus from '$lib/icons/plus.svelte'
	import Modal from '$lib/components/modal.svelte'
	import CentsToDollarsField from '$lib/components/cents-to-dollars-field.svelte'
	import axios from 'redaxios'
	import { invalidateAll } from '$app/navigation'
	import { to } from '$lib/lilUtils'
	import SelectCatField from '$lib/components/select-cat-field.svelte'
	import MiltiSelectCatField from '$lib/components/multi-select-cat-field.svelte'
	import AddShare from '$lib/components/add-share.svelte'
	import DisplayCat from '$lib/components/display-cat-field.svelte'
	import { untrack } from 'svelte'
	import { toasts } from '$lib/toast'

	const { month, cats, shareGroups }: props = $props()

	let showModal = $state(false)
	let modalMode: 'addNew' | 'edit' | 'addMulti' | null = $state(null)
	let lgModal: boolean = $state(false)
	let errorBag: errorBagType = $state({})

	let newSelectedCats: cat[] = $state([])
	let multiNewFields: newFieldsType[] = $state([])
	let totalMultiFields: number = $derived.by(() =>
		multiNewFields.reduce((accum, item) => item.amount + accum, 0)
	)
	const addNewFields: newFieldsType = $state({
		monthId: month.id,
		catId: 0,
		name: '',
		amount: 0,
		note: ''
	})

	let totalMultiRemaining: number = $derived(totalMultiFields - addNewFields.amount)

	$effect(() => {
		// Remove multiNewField items that are not selectedCats
		// loop backwards since we are potentially removing items
		for (let i = multiNewFields.length - 1; i >= 0; i--) {
			const fieldObj = multiNewFields[i]
			const match = untrack(() => newSelectedCats.find(item => item.id === fieldObj.catId))
			if (match === undefined) untrack(() => multiNewFields.splice(i, 1))
		}

		// - loop through selectedCats, if item matches a multiNewField then do nothing, otherwise add a new field item to multiNewfield
		for (let i = 0; i < newSelectedCats.length; i++) {
			const selectedCat = newSelectedCats[i]
			const match = untrack(() => multiNewFields.find(item => item.catId === selectedCat.id))
			if (match === undefined)
				untrack(() =>
					multiNewFields.push({
						monthId: month.id,
						catId: selectedCat.id,
						name: addNewFields.name,
						amount: 0,
						note: ''
					})
				)
		}
	})

	const editFields: editFieldsType = $state({
		id: 0,
		monthId: 0,
		catId: 0,
		name: '',
		note: '',
		amount: 0
	})

	function startAddNew() {
		errorBag = {}
		delete addNewFields.share
		addNewFields.monthId = month.id
		addNewFields.catId = 0
		addNewFields.name = ''
		addNewFields.amount = 0
		addNewFields.note = ''

		modalMode = 'addNew'
		lgModal = false
		showModal = true
	}

	function startAddMulti() {
		newSelectedCats = []
		multiNewFields = []
		errorBag = {}
		delete addNewFields.share
		addNewFields.monthId = month.id
		addNewFields.catId = 0
		addNewFields.name = ''
		addNewFields.amount = 0
		addNewFields.note = ''

		modalMode = 'addMulti'
		lgModal = true
		showModal = true
	}

	async function saveNew(e?: Event) {
		if (e) e.preventDefault()

		const { err }: { err: any; res: any } = await to(axios.post('/api/transactions', addNewFields))
		if (err) {
			console.error('err: ', err)

			const data: apiErr = err.data
			if (data?.errors?.issues?.length) errorBag = fillErrorBag(data.errors.issues)
		}

		if (!err) showModal = false

		await invalidateAll()
	}

	async function saveMulti(e?: Event) {
		if (e) e.preventDefault()
		errorBag = {}

		if (multiNewFields.length === 0) {
			toasts.warning('At least one category is required')
			return
		}

		let areAnyEmpty = false

		multiNewFields.forEach(item => {
			item.name = addNewFields.name
			item.note = addNewFields.note

			if (item.amount === 0) areAnyEmpty = true
		})

		if (areAnyEmpty) {
			toasts.warning('Not all amounts were entered')
			return
		}

		const errIndexes: number[] = []

		for (const [i, item] of multiNewFields.entries()) {
			const { err }: { err: any; res: any } = await to(axios.post('/api/transactions', item))
			if (err) {
				console.error('err: ', err)

				const data: apiErr = err.data
				if (data?.errors?.issues?.length) errorBag = fillErrorBag(data.errors.issues)

				errIndexes.push(i)
				return
			}
		}

		if (errIndexes.length) {
			toasts.warning(
				`Some errors occured, ${multiNewFields.length - errIndexes.length}/${multiNewFields.length} successfully saved`
			)
			multiNewFields = multiNewFields.filter((item, i) => !errIndexes.includes(i))
			return
		}

		showModal = false
		await invalidateAll()
	}

	function startEditEntry(entry: transaction) {
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

	async function saveEdit(e?: Event) {
		if (e) e.preventDefault()

		const { err } = await to(axios.put('/api/transactions', editFields))
		if (err) console.error('err: ', err)
		if (!err) showModal = false

		await invalidateAll()
	}

	function combineShares(amount: number, shares: shareItem[]) {
		const sharesAmount = shares.reduce((accum, cur) => (accum += cur.amount), 0)
		return amount - sharesAmount
	}
</script>

<section class="container_sm">
	<div class="sub_area">
		<div class="sub_head">
			<h2 class="h4 sec_title">Transactions</h2>
			<div class="btn_wrap">
				<button class="btn_round" onclick={startAddNew} title="Add new transaction"
					><Plus /></button>
				<button class="btn_round" onclick={startAddMulti} title="Add multible new transactions"
					><Plus /> <Plus /></button>
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
				<button class="ft_row" onclick={() => startEditEntry(item)} title="Edit Transaction">
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
			<button class="btn" onclick={startAddNew}><Plus /><span>Transaction</span></button>
		</div>
	</div>
</section>

<Modal bind:showModal bind:lgModal onClose={() => (modalMode = null)}>
	{#if modalMode === 'addMulti'}
		<h2 class="h5">Multi Transaction</h2>

		{#if Object.keys(errorBag).length}
			<ul class="err_list">
				{#each Object.entries(errorBag) as [key, value]}
					<li class="err_item">
						<p class="">{value}</p>
					</li>
				{/each}
			</ul>
		{/if}

		<form onsubmit={saveMulti}>
			<div class="split_area">
				<div class="main">
					<label class:is_error={errorBag.name}>
						<span class="label">Name</span>
						<!-- svelte-ignore a11y_autofocus -->
						<input type="text" bind:value={addNewFields.name} autofocus />
						{#if errorBag.name}
							<div class="error_space">
								<p>{errorBag.name}</p>
							</div>
						{/if}
					</label>
					<CentsToDollarsField label="Total Amount" bind:value={addNewFields.amount} />
					<MiltiSelectCatField value={newSelectedCats} {cats} />
				</div>
				<div class="multi_list">
					{#each multiNewFields as tranItem}
						<div class="item_area">
							<!-- <p class="display">{ tranItem.name }</p> -->
							<DisplayCat value={tranItem.catId} {cats} />
							<CentsToDollarsField label="Amount" bind:value={tranItem.amount} />
							<AddShare
								bind:value={tranItem.share}
								amount={tranItem.amount}
								tranId={0}
								{shareGroups} />
						</div>
					{/each}
				</div>
			</div>

			<div class="total_remain">
				<p class="label" class:good={totalMultiRemaining === 0}>
					Total Remaining: {`${totalMultiRemaining > 0 ? '+' : ''}`}{centsToDollars(
						totalMultiRemaining
					)}
				</p>
			</div>
			<div class="btn_wrap __left">
				<button class="btn" type="submit">Submit</button>
			</div>
		</form>
	{/if}

	{#if modalMode === 'addNew'}
		<h2 class="h5">New Transaction</h2>

		{#if Object.keys(errorBag).length}
			<ul class="err_list">
				{#each Object.entries(errorBag) as [key, value]}
					<li class="err_item">
						<p class="">{value}</p>
					</li>
				{/each}
			</ul>
		{/if}

		<form onsubmit={saveNew}>
			<label class:is_error={errorBag.name}>
				<span class="label">Name</span>
				<!-- svelte-ignore a11y_autofocus -->
				<input type="text" bind:value={addNewFields.name} autofocus />
				{#if errorBag.name}
					<div class="error_space">
						<p>{errorBag.name}</p>
					</div>
				{/if}
			</label>
			<CentsToDollarsField label="Amount" bind:value={addNewFields.amount} />
			<SelectCatField bind:value={addNewFields.catId} {cats} />
			<AddShare
				bind:value={addNewFields.share}
				amount={addNewFields.amount}
				tranId={0}
				{shareGroups} />
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

		<form onsubmit={saveEdit}>
			<label>
				<span class="label">Name</span>
				<!-- svelte-ignore a11y_autofocus -->
				<input type="text" bind:value={editFields.name} autofocus />
			</label>
			<CentsToDollarsField label="Amount" bind:value={editFields.amount} />
			<SelectCatField bind:value={editFields.catId} {cats} />
			<AddShare
				bind:value={editFields.share}
				amount={editFields.amount}
				tranId={editFields.id}
				{shareGroups} />
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

	.split_area {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: var(--size-4);

		.main {
			flex: 0 0 auto;
			margin-bottom: var(--size-4);
		}

		.multi_list {
			flex: 1 1 auto;
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			flex-wrap: wrap;
			gap: var(--size-4);
		}
	}

	.total_remain {
		margin-bottom: var(--size-4);

		.label {
			color: var(--color-red);

			&.good {
				color: var(--color-green);
			}
		}
	}

	form {
		@media (--md) {
			min-width: 360px;
		}
	}

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
