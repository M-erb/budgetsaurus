<script lang="ts" module>
	interface editFieldsType {
		id: number
		name: string
		note: string | null
		color: string | null
		budget?: {
			id: number
			monthId: number
			catId: number
			amount: number
		}
	}

	interface newFieldsType {
		name: string
		note: string | null
		color: string | null
		budget?: {
			monthId: number
			catId: number
			amount: number
		}
	}
</script>

<script lang="ts">
	import type { cat } from '$lib/components/monthly-report.svelte'
	import Modal from './modal.svelte'
	import axios from 'redaxios'
	import { invalidateAll } from '$app/navigation'
	import { to } from '$lib/lilUtils'
	import AddBudget from '$lib/components/add-budget.svelte'

	interface Props {
		type: 'addNew' | 'edit' | ''
		cats: cat[]
		monthId: number
		editCatId: number
	}

	let { type = $bindable(), cats, monthId, editCatId }: Props = $props()
	let showModal = $state(false)
	const addNewFields: newFieldsType = $state({
		name: '',
		note: '',
		color: ''
	})

	const editFields: editFieldsType = $state({
		id: 0,
		name: '',
		note: '',
		color: ''
	})

	$effect(() => {
		if (type === 'edit') startEditEntry()
		if (type === 'addNew') startAddNew()
	})

	function startAddNew() {
		delete addNewFields.budget
		addNewFields.name = ''
		addNewFields.note = ''
		addNewFields.color = ''

		showModal = true
		type = 'addNew'
	}

	function startEditEntry() {
		delete editFields.budget

		const cat = cats.find(item => item.id === editCatId)
		if (!cat) throw Error('cannot find category')

		editFields.id = cat.id
		editFields.name = cat.name
		editFields.note = cat.note
		editFields.color = cat.color

		if (cat.budgets.length) {
			const budget = cat.budgets[0]
			editFields.budget = {
				id: budget.id,
				monthId: budget.monthId,
				catId: budget.catId,
				amount: budget.amount
			}
		}

		type = 'edit'
		showModal = true
	}

	async function saveNew(e: Event) {
		e.preventDefault()
		const { err } = await to(axios.post('/api/cats', addNewFields))
		if (err) console.error('err: ', err)
		if (!err) {
			showModal = false
			type = ''
		}

		await invalidateAll()
	}

	async function saveEdit(e: Event) {
		e.preventDefault()
		const { err } = await to(axios.put('/api/cats', editFields))
		if (err) console.error('err: ', err)
		if (!err) {
			showModal = false
			type = ''
		}

		await invalidateAll()
	}
</script>

<Modal bind:showModal onClose={() => (type = '')}>
	{#if type === 'addNew'}
		<h2 class="h5">New Category</h2>

		<form onsubmit={saveNew}>
			<label>
				<span class="label">Name</span>
				<!-- svelte-ignore a11y_autofocus -->
				<input type="text" bind:value={addNewFields.name} autofocus />
			</label>
			<label>
				<span class="label">Color</span>
				<input type="color" bind:value={addNewFields.color} />
			</label>
			<AddBudget bind:value={addNewFields.budget} {monthId} />
			<label>
				<span class="label">Note</span>
				<textarea bind:value={addNewFields.note}></textarea>
			</label>
			<div class="btn_wrap __right">
				<button class="btn">Submit</button>
			</div>
		</form>
	{/if}

	{#if type === 'edit'}
		<h2 class="h5">Edit Category</h2>

		<form onsubmit={saveEdit}>
			<label>
				<span class="label">Name</span>
				<!-- svelte-ignore a11y_autofocus -->
				<input type="text" bind:value={editFields.name} autofocus />
			</label>
			<label>
				<span class="label">Color</span>
				<input type="color" bind:value={editFields.color} />
			</label>
			<AddBudget bind:value={editFields.budget} {monthId} />
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
	/* @import '@styles/mediaQueries.pcss'; */
</style>
