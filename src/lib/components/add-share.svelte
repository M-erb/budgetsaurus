<script lang="ts">
	import { onMount } from 'svelte'
	import SelectSharegroupField from '$lib/components/select-sharegroup-field.svelte'
	import Plus from '$lib/icons/plus.svelte'
	import Minus from '$lib/icons/minus.svelte'
	import CentsToDollarsField from '$lib/components/cents-to-dollars-field.svelte'

	interface shareGroup {
		id: number
		name: string
		createdAt: Date | null
		note: string | null
	}

	interface share {
		shareGroupId: number
		tranId: number
		amount: number
		note: string | null
	}

	interface Props {
		value: share | undefined
		amount: number
		tranId: number
		shareGroups: shareGroup[]
	}

	let { value = $bindable(), amount, tranId, shareGroups }: Props = $props()
	let active = $state(false)

	// ensure that share amount is never above the transaction amount
	$effect(() => {
		if (value && value.amount > amount) value.amount = amount
	})

	onMount(() => {
		if (value) active = true
		else active = false
	})

	function activate() {
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

	const useHalf = (e: Event) => {
		e.preventDefault()
		if (value) value.amount = Math.floor(amount / 2)
	}

	const useFull = (e: Event) => {
		e.preventDefault()
		if (value) value.amount = amount
	}
</script>

<div class="add_share">
	<div class="btn_wrap">
		<button class="btn __alt __sm" type="button" onclick={activate}>
			{#if active}
				<Minus />
			{:else}
				<Plus />
			{/if}
			<span>Share</span>
		</button>
	</div>

	{#if active && value}
		<SelectSharegroupField bind:value={value.shareGroupId} {shareGroups} />
		<CentsToDollarsField label="Amount to share" bind:value={value.amount} />
		<div class="btn_wrap">
			<button class="btn __alt __sm" type="button" onclick={useHalf}>half</button>
			<button class="btn __alt __sm" type="button" onclick={useFull}>Full</button>
		</div>
	{/if}
</div>

<style lang="postcss">
	/* @import '@styles/mediaQueries.pcss'; */

	.btn_wrap {
		margin-bottom: var(--size-4);
	}

	.btn {
		& :global(svg) {
			width: 16px;
			height: 16px;
		}
	}
</style>
