<script lang=ts>
	import type { monthlyReportType, cat } from '$lib/components/monthly-report.svelte'
	import Modal from './modal.svelte'
	import axios from 'redaxios'
	import { invalidateAll } from '$app/navigation'
	import { to } from '$lib/lilUtils'
	import AddBudget from '$lib/components/add-budget.svelte'

	let showModal = false
	let modalMode: 'addNew'|'edit'|null = null
	export let cats: cat[]
	export let monthId: number
	const addNewFields: newFieldsType = {
		name: '',
		note: '',
		color: ''
	}

	const editFields: editFieldsType = {
		id: 0,
		name: '',
		note: '',
		color: ''
	}

	export function startAddNew () {
		delete addNewFields.budget
		addNewFields.name = ''
		addNewFields.note = ''
		addNewFields.color = ''

		showModal = true
		modalMode = 'addNew'
	}

	export function startEditEntry (entry: monthlyReportType) {
		delete editFields.budget

		const cat = cats.find(item => item.id === entry.catId)
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

		modalMode = 'edit'
		showModal = true
	}

	async function saveNew () {
		const {err} = await to(axios.post('/api/cats', addNewFields))
		if (err) {
			console.error('err: ', err)
			return
		}

		showModal = false
		await invalidateAll()
	}

	async function saveEdit () {
		const {err} = await to(axios.put('/api/cats', editFields))
		if (err) {
			console.error('err: ', err)
			return
		}

		showModal = false
		await invalidateAll()
	}
</script>

<script lang=ts context="module">
	interface editFieldsType {
		id: number
		name: string
		note: string|null
		color: string|null
		budget?: {
			id: number
			monthId: number
			catId: number
			amount: number
		}
	}

	interface newFieldsType {
		name: string
		note: string|null
		color: string|null
		budget?: {
			monthId: number
			catId: number
			amount: number
		}
	}
</script>

<Modal bind:showModal on:close={() => modalMode = null}>
	{#if modalMode === 'addNew'}
		<h2 class="h5">New Category</h2>

		<form on:submit|preventDefault={saveNew}>
			<label>
				<span class="label">Name</span>
				<!-- svelte-ignore a11y-autofocus -->
				<input type="text" bind:value={addNewFields.name} autofocus>
			</label>
			<label>
				<span class="label">Color</span>
				<input type="color" bind:value={addNewFields.color}>
			</label>
			<AddBudget bind:value={addNewFields.budget} monthId={monthId} />
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
		<h2 class="h5">Edit Category</h2>

		<form on:submit|preventDefault={saveEdit}>
			<label>
				<span class="label">Name</span>
				<!-- svelte-ignore a11y-autofocus -->
				<input type="text" bind:value={editFields.name} autofocus>
			</label>
			<label>
				<span class="label">Color</span>
				<input type="color" bind:value={editFields.color}>
			</label>
			<AddBudget bind:value={editFields.budget} monthId={monthId} />
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