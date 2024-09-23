<script lang=ts>
	import { onMount } from 'svelte'
	import SelectSharegroupField from '$lib/components/select-sharegroup-field.svelte'
	import Plus from '$lib/icons/plus.svelte'
	import Minus from '$lib/icons/minus.svelte'
	import CentsToDollarsField from '$lib/components/cents-to-dollars-field.svelte'

	interface shareGroup {
		id: number
		name: string
		createdAt: Date|null
		note: string|null
	}

	interface share {
		shareGroupId: number
		tranId: number
		amount: number
		note: string|null
	}

	export let value: share|undefined
	export let amount: number
	export let tranId: number
	export let shareGroups: shareGroup[]
	let active = false

	// ensure that share amount is never above the transaction amount
	$: if (value && value.amount > amount) value.amount = amount

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
				shareGroupId: 0,
				tranId,
				amount: 0,
				note: ''
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
			<span>{active ? 'Remove Share' : 'Add Share'}</span>
		</button>
	</div>

	{#if active && value}
		<SelectSharegroupField bind:value={value.shareGroupId} shareGroups={shareGroups} />
		<CentsToDollarsField label="Amount to share" bind:value={value.amount} />
	{/if}
</div>

<style lang="postcss">
	/* @import '@styles/mediaQueries.pcss'; */

	.btn_wrap {
		margin-bottom: var(--size-4);
	}
</style>