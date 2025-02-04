<script lang="ts">
	import { getYear, addMonths } from 'date-fns'
	import { returnMonth, monthsLongList, to } from '$lib/lilUtils'
	import { createEventDispatcher } from 'svelte'
	import axios from 'redaxios'
	import { invalidateAll } from '$app/navigation'

	interface fieldsType {
		year: number
		month: monthsLong
	}

	const dispatch = createEventDispatcher()
	const today = new Date()
	interface Props {
		year?: number
		offsetMonth?: number
		month?: number | null
	}

	let { year = getYear(today), offsetMonth = 0, month = null }: Props = $props()

	const fields: fieldsType = $state({
		year,
		month:
			month !== null
				? monthsLongList[month]
				: returnMonth(addMonths(today, offsetMonth), { returnType: 'long' })
	})

	async function handleSubmit(e: Event) {
		e.preventDefault()
		const { res, err } = await to(axios.post('/api/months', fields))
		if (err) {
			console.error('err: ', err)
			dispatch('error', err)
			return
		}

		await invalidateAll()
		dispatch('finished', res?.data)
	}
</script>

<form class="get_started_form" onsubmit={handleSubmit}>
	<label for="">
		<span class="label">Year</span>
		<input type="text" bind:value={fields.year} />
	</label>

	<label>
		<span class="label">Month</span>
		<select bind:value={fields.month}>
			{#each monthsLongList as item}
				<option>{item}</option>
			{/each}
		</select>
	</label>

	<div class="btn_wrap __right">
		<button class="btn" type="submit">Add</button>
	</div>
</form>

<style lang="postcss">
	.get_started_form {
		max-width: var(--size-96);
	}
</style>
