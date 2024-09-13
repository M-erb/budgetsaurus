<script lang="ts">
	import { getYear, addMonths } from 'date-fns'
	import { returnMonth, monthsLongList, to } from '$lib/lilUtils'
	import axios from 'redaxios'

	interface fields {
		year: number,
		month: monthsLong
	}

	export let offsetMonth:number = 1
	const today = new Date()

	const fields:fields = {
		year: getYear(today),
		month: returnMonth(addMonths(today, offsetMonth), { returnType: 'long' })
	}

	async function handleSubmit () {
		const {res, err} = await to(axios.post('/api/months', fields))
		if (err) console.error('err: ', err)
		console.log('res.data: ', res!.data)
	}
</script>

<form class="get_started_form" on:submit|preventDefault={handleSubmit}>
	<label for="">
		<span class="label">Year</span>
		<input type="text" bind:value={fields.year}>
	</label>

	<label>
		<span class="label">Month</span>
		<select bind:value={fields.month}>
			{#each monthsLongList as item}
				<option>{item}</option>
			{/each}
		</select>
	</label>

	<div class="btn_wrap __center">
		<button class="btn" type="submit">Add</button>
	</div>
</form>

<style lang="postcss">
	.get_started_form {
		max-width: var(--size-96);
	}
</style>
