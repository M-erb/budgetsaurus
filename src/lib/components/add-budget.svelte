<script lang=ts>
	import { onMount } from 'svelte'
	import Plus from '$lib/icons/plus.svelte'
	import Minus from '$lib/icons/minus.svelte'
	import CentsToDollarsField from '$lib/components/cents-to-dollars-field.svelte'
    import { number } from 'zod';

	interface budget {
		catId: number
		monthId: number
		amount: number
	}

	export let value: budget|undefined
	export let monthId: number
	let active = false

	onMount(() => {
		if (value) active = true
		else active = false
	})

	function activate () {
		if (active) {
			active = false
			value = undefined
			return
		}

		if (value === undefined) {
			value = {
				monthId,
				catId: 0,
				amount: 0
			}
		}

		active = true
	}
</script>

<div class="add_share">
	<div class="btn_wrap">
		<button class="btn" type="button" on:click={activate}>
			{#if active}
				<Minus />
				{:else}
				<Plus />
			{/if}
			<span>{active ? 'Remove Budget' : 'Add Budget'}</span>
		</button>
	</div>

	{#if active && value}
		<CentsToDollarsField label="Budget Amount" bind:value={value.amount} />
	{/if}
</div>

<style lang="postcss">
	/* @import '@styles/mediaQueries.pcss'; */

	.btn_wrap {
		margin-bottom: var(--size-4);
	}
</style>