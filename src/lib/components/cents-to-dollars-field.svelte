<script lang="ts">
	import { run } from 'svelte/legacy'

	import Dollar from '$lib/icons/dollar.svelte'
	import { numFormat } from '$lib/lilUtils'
	interface Props {
		label?: string
		value: number | string
	}

	let { label = '', value = $bindable() }: Props = $props()
	let display: string = $state('')

	function centsToDollars(num: number): string {
		const dollars = num / 100
		if (dollars === 0) return '0.00'

		const result = String(numFormat(dollars, { style: 'decimal', min: 2 }))
		return result
	}

	function controlSelect(e: Event) {
		const target = e.target as HTMLInputElement
		target.selectionStart = target.selectionEnd
	}
	run(() => {
		value = typeof value === 'string' ? Number(value.replace(/\D/g, '')) : Number(value)
		display = centsToDollars(value)
	})
</script>

<label class="centsToDollars">
	{#if label}
		<span class="label">{label}</span>
	{/if}

	<div class="num_field">
		<Dollar />
		<input type="text" bind:value onselect={controlSelect} />
		<div class="fake_input">
			<span class="num_display">{display}</span>
		</div>
	</div>
</label>

<style lang="postcss">
	/* @import '@styles/mediaQueries.pcss'; */

	.num_field {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--size-2);

		font-family: var(--font-mono);
		background-color: var(--color-slate-500);
		border: 1px solid var(--color-grey-300);
		border-radius: var(--radius-md);
		padding: var(--size-2) var(--size-2) var(--size-2) 0;
		transition:
			color 0.3s ease-in-out,
			border-color 0.3s ease-in-out;
		line-height: 1.4;
		cursor: pointer;

		.fake_input {
			flex: 1 1 auto;
			width: 100%;
			color: var(--color-white);
			line-height: 1.4;

			.num_display {
				&::after {
					content: '';
					display: none;
					position: absolute;
					top: 0;
					right: -2px;
					height: 100%;
					width: 1px;
					background-color: var(--color-white);

					animation-name: blink;
					animation-duration: 1.2s;
					animation-iteration-count: infinite;
					animation-timing-function: cubic-bezier(1, 0, 0, 1);
					animation-fill-mode: both;
				}
			}
		}

		&:focus-within {
			outline: 3px solid var(--color-blue);

			.fake_input .num_display::after {
				display: block;
			}
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
			max-width: 0;
			width: 0;
			padding: 0;
			margin: 0;

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
