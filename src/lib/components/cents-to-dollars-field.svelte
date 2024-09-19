<script lang=ts>
	import { onMount } from 'svelte'
	import Dollar from '$lib/icons/dollar.svelte'
	import { numFormat } from '$lib/lilUtils'
	export let label = ''
	export let value: number|string
	let display = ''

	$: {
		value = typeof value === 'string' ? Number(value.replace(/\D/g,'')) : Number(value)
		display = centsToDollars(value)
	}

	function centsToDollars (num:number):string {
		const dollars = num / 100
		if (dollars === 0) return '0.00'

		const result = String(numFormat(dollars, { style: 'decimal', min: 2 }))
		return result
	}

	onMount(() => {

	})
</script>

<label class="centsToDollars">
	{#if label}
		<span class="label">{label}</span>
	{/if}

	<div class="num_field">
		<Dollar />
		<input type="text" bind:value={value} />
		<span class="fake_input">{display}</span>
	</div>
</label>

<style lang="postcss">
	/* @import '@styles/mediaQueries.pcss'; */

	label {
		position: relative;
		z-index: 1;
	}

	.num_field {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--size-2);

		position: relative;
		z-index: 1;
		font-family: var(--font-mono);
		background-color: var(--color-slate-500);
		border: 1px solid var(--color-grey-300);
		border-radius: var(--radius-md);
		padding: var(--size-2) var(--size-2) var(--size-2) 0;
		transition: color .3s ease-in-out, border-color .3s ease-in-out;
		line-height: 1.4;

		.fake_input {
			flex: 1 1 auto;
			width: 100%;
			color: var(--color-white);
			line-height: 1.4;
		}

		&:focus-within {
			outline: 3px solid var(--color-blue);
		}

		input {
			position: absolute;
			top: 0;
			right: 0;
			z-index: -1;
			padding: 0;
			background-color: transparent;
			border: none;
			color: transparent;
			min-width: auto;
			max-width: 100px;

			&:focus {
				outline: none;
			}
		}

		& :global(svg) {
			display: block;
			flex: 0 0 24px;
		}
	}
</style>