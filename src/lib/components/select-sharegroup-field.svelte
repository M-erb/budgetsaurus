<script lang=ts>
	import { onMount } from 'svelte'
	import ChevronUp from '$lib/icons/chevron-up.svelte'

	interface shareGroup {
		id: number
		name: string
		createdAt: Date|null
		note: string|null
	}

	export let value: number|undefined
	export let shareGroups: shareGroup[]

	let active = false
	let selected: shareGroup|undefined

	$: selected = value ? shareGroups.find(item => item.id === value) : undefined

	function select (shareGroup: shareGroup) {
		value = shareGroup.id
		active = false
	}

	onMount(() => {
		if (shareGroups.length && !selected) select(shareGroups[0])
	})
</script>

<div class="select_field_area" class:active>
	<span class="label">Select Share Group</span>

	<button class="select_field" type="button" on:click={() => active = !active}>
		<div class="name_area">
			<span class="selected_value">{ selected ? selected.name : 'Select a Group' }</span>
		</div>
		<ChevronUp />
	</button>

	<ul class="dropdown_options">
		{#each shareGroups as shareGroup }
			<li class="option" title={shareGroup.note}>
				<button type="button" on:click|preventDefault={() => select(shareGroup)}>
					<span class="cat_name">{shareGroup.name}</span>
				</button>
			</li>
		{/each}
	</ul>
</div>

<style lang="postcss">
	@import '@styles/mediaQueries.pcss';

	.select_field_area {
		margin-bottom: var(--size-4);
		position: relative;
		z-index: 2;

		& > .label {
			display: block;
			font-family: var(--font-body);
			font-size: var(--scale-00);
			font-weight: bold;
			text-transform: uppercase;
			margin-bottom: var(--size-1);
			transition: color .3s ease-in-out, border-color .3s ease-in-out;
		}

		.select_field {
			width: 100%;
			min-width: 200px;
			font-family: var(--font-body);
			font-size: var(--scale-00);
			color: var(--color-white);
			line-height: 1.4;
			background-color: var(--color-slate-500);
			border: 1px solid var(--color-grey-300);
			border-radius: var(--radius-md);
			padding: var(--size-2);
			cursor: pointer;
			transition: color .3s ease-in-out, border-color .3s ease-in-out;

			&:focus-visible {
				outline: 3px solid var(--color-blue);
			}

			display: flex;
			justify-content: space-between;
			align-items: center;
			gap: var(--size-2);

			.name_area {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				gap: var(--size-2);
			}

			& :global(svg) {
				transform: rotate(180deg);
				transition: transform .3s ease-in-out;
			}
		}

		.dropdown_options {
			width: 100%;
			min-width: 200px;
			background-color: var(--color-slate-700);
			border: 1px solid var(--color-grey-300);
			border-radius: var(--radius-md);
			padding: var(--size-2);
			margin-top: var(--size-2);
			position: absolute;
			top: 100%;

			display: none;

			.option {
				padding: var(--size-1);

				button {
					border: none;
					background-color: transparent;
					color: inherit;
					cursor: pointer;
					width: 100%;

					display: flex;
					justify-content: flex-start;
					align-items: center;
					gap: var(--size-4);
				}
			}
		}

		&.active {
			.select_field {
				outline: 3px solid var(--color-blue);

				& :global(svg) {
					transform: rotate(0deg);
				}
			}

			.dropdown_options {
				display: block;
			}
		}
	}
</style>