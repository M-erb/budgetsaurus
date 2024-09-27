<script lang=ts>
	import { onMount } from 'svelte'
	import ChevronUp from '$lib/icons/chevron-up.svelte'

	interface cat {
		id: number
		note: string|null
		createdAt: Date|null
		color: string
		name: string
	}

	export let value: number
	export let cats: cat[]

	let active = false
	let selected: cat|undefined
	let searchTxt: string = ''
	let filteredCats: cat[]

	$: selected = value ? cats.find(item => item.id === value) : undefined
	$: filteredCats = cats.filter(cat => cat.name.toLocaleLowerCase().includes(searchTxt.toLocaleLowerCase()))

	function select (cat: cat) {
		value = cat.id
		active = false
	}

	onMount(() => {
		filteredCats = structuredClone(cats)
	})
</script>

<div class="select_field_area" class:active>
	<span class="label">Category</span>

	<button class="select_field" type="button" on:click={() => active = !active}>
		<div class="name_area">
			{#if selected}
				<div class="color" style:background-color={selected.color}></div>
			{/if}
			<span class="selected_value">{ selected ? selected.name : 'Select a Category' }</span>
		</div>
		<ChevronUp />
	</button>

	<ul class="dropdown_options">
		<li class="search">
			<label>
				<input type="text" name="search_categories" bind:value={searchTxt} placeholder="search for categories">
			</label>
		</li>
		{#each filteredCats as cat }
			<li class="option">
				<button type="button" on:click|preventDefault={() => select(cat)}>
					<div class="color" style:background-color={cat.color}></div>
					<span class="cat_name">{cat.name}</span>
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

		.color {
			width: 24px;
			height: 24px;
			border-radius: var(--radius-full);
		}

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

			button {
				border: none;
				background-color: transparent;
				border-radius: var(--radius-md);
				color: inherit;
				cursor: pointer;
				width: 100%;
				padding: var(--size-1);

				display: flex;
				justify-content: flex-start;
				align-items: center;
				gap: var(--size-4);

				&:hover {
					background-color: var(--color-slate-500);
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