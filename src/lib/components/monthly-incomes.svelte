<script lang="ts">
	import { centsToDollars, isNegative } from '$lib/lilUtils'
	import Plus from '$lib/icons/plus.svelte'
	import ThumbsDown from '$lib/icons/thumbs-down.svelte'
	import ThumbsUp from '$lib/icons/thumbs-up.svelte'
	import Modal from './modal.svelte'
	import CentsToDollarsField from '$lib/components/cents-to-dollars-field.svelte'
	import axios from 'redaxios'
	import { invalidateAll } from '$app/navigation'
	import { to } from '$lib/lilUtils'

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

	interface income {
		date: Date | null
		id: number
		name: string
		createdAt: Date | null
		note: string | null
		monthId: number
		amount: number
		planned: number
		month: {
			id: number
			yearId: number
			name: string
			note: string | null
		}
	}

	interface Props {
		month: {
			id: number
			note: string | null
			name: string
			yearId: number
			transactions: {
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
			}[]
			incomes: income[]
			year: {
				id: number
				name: string
				note: string | null
			}
		}
	}

	let { month }: Props = $props()

	let showModal = $state(false)
	let modalMode: 'addNew' | 'edit' | null = $state(null)
	const addNewFields = $state({
		monthId: month.id,
		name: '',
		note: '',
		planned: 0,
		amount: 0
	})

	interface editFieldsType {
		id: number
		monthId: number
		name: string
		note: string | null
		planned: number
		amount: number
	}

	const editFields: editFieldsType = $state({
		id: 0,
		monthId: 0,
		name: '',
		note: '',
		planned: 0,
		amount: 0
	})

	function startAddNew() {
		addNewFields.name = ''
		addNewFields.planned = 0
		addNewFields.amount = 0
		addNewFields.note = ''

		showModal = true
		modalMode = 'addNew'
	}

	function startEditEntry(entry: income) {
		editFields.id = entry.id
		editFields.monthId = entry.monthId
		editFields.name = entry.name
		editFields.note = entry.note
		editFields.planned = entry.planned
		editFields.amount = entry.amount

		modalMode = 'edit'
		showModal = true
	}

	async function saveNew(e: Event) {
		e.preventDefault()
		const { err } = await to(axios.post('/api/incomes', addNewFields))
		if (err) console.error('err: ', err)
		if (!err) showModal = false

		await invalidateAll()
	}

	async function saveEdit(e: Event) {
		e.preventDefault()
		const { err } = await to(axios.put('/api/incomes', editFields))
		if (err) console.error('err: ', err)
		if (!err) showModal = false

		await invalidateAll()
	}
</script>

<section class="container_sm">
	<div class="sub_area">
		<div class="sub_head">
			<h2 class="h4 sec_title">Income</h2>
			<div class="btn_wrap">
				<button class="btn_round" onclick={startAddNew}><Plus /></button>
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
				<button class="ft_row" onclick={() => startEditEntry(item)} title="Edit Income">
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
				</button>
			{/each}
		</div>

		<div class="btn_wrap __left __t_space">
			<button class="btn" onclick={startAddNew}><Plus /><span>Transaction</span></button>
		</div>
	</div>
</section>

<Modal bind:showModal onClose={() => (modalMode = null)}>
	{#if modalMode === 'addNew'}
		<form onsubmit={saveNew}>
			<label>
				<span class="label">Name</span>
				<!-- svelte-ignore a11y_autofocus -->
				<input type="text" bind:value={addNewFields.name} autofocus />
			</label>
			<CentsToDollarsField label="Planned" bind:value={addNewFields.planned} />
			<CentsToDollarsField label="Actual" bind:value={addNewFields.amount} />
			<label>
				<span class="label">Note</span>
				<textarea bind:value={addNewFields.note}></textarea>
			</label>
			<div class="btn_wrap __right">
				<button class="btn">Submit</button>
			</div>
		</form>
	{/if}

	{#if modalMode === 'edit'}
		<form onsubmit={saveEdit}>
			<label>
				<span class="label">Name</span>
				<!-- svelte-ignore a11y_autofocus -->
				<input type="text" bind:value={editFields.name} autofocus />
			</label>
			<CentsToDollarsField label="Planned" bind:value={editFields.planned} />
			<CentsToDollarsField label="Actual" bind:value={editFields.amount} />
			<label>
				<span class="label">Note</span>
				<textarea bind:value={editFields.note}></textarea>
			</label>
			<div class="btn_wrap __right">
				<button class="btn">Submit</button>
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
