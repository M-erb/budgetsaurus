<script lang="ts">
	import ChevronUp from '$lib/icons/chevron-up.svelte'

	interface cat {
		id: number
		note: string | null
		createdAt: Date | null
		color: string
		name: string
	}

	interface Props {
		value: number
		cats: cat[]
	}

	let { value = $bindable(), cats }: Props = $props()

	let active = $state(false)
	let selected: cat | undefined = $derived(value ? cats.find(item => item.id === value) : undefined)
	let searchTxt: string = $state('')
	let filteredCats: cat[] = $derived.by(() =>
		cats.filter(cat => cat.name.toLocaleLowerCase().includes(searchTxt.toLocaleLowerCase()))
	)

	function select(cat: cat, e: Event) {
		e.preventDefault()
		value = cat.id
		active = false
	}

	function handleKey(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') active = true
	}

	function handleBlur(e: FocusEvent) {
		if (e.relatedTarget) return
		active = false
	}
</script>

<div class="select_field_area" class:active onfocusout={handleBlur}>
	<span class="label">Category</span>

	<button
		class="select_field"
		type="button"
		onclick={() => (active = !active)}
		onkeydown={handleKey}>
		<div class="name_area">
			{#if selected}
				<div class="cat_color" style:background-color={selected.color}></div>
			{/if}
			<span class="selected_value">{selected ? selected.name : 'Select a Category'}</span>
		</div>
		<ChevronUp />
	</button>

	<ul class="dropdown_options">
		<li class="search">
			<label>
				<input
					type="text"
					name="search_categories"
					bind:value={searchTxt}
					placeholder="search for categories" />
			</label>
		</li>
		{#each filteredCats as cat (cat.id)}
			<li class="option">
				<button type="button" onclick={e => select(cat, e)}>
					<div class="cat_color" style:background-color={cat.color}></div>
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

		& > .label {
			display: block;
			font-family: var(--font-body);
			font-size: var(--scale-00);
			font-weight: bold;
			text-transform: uppercase;
			margin-bottom: var(--size-1);
			transition:
				color 0.3s ease-in-out,
				border-color 0.3s ease-in-out;
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
			transition:
				color 0.3s ease-in-out,
				border-color 0.3s ease-in-out;

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
				transition: transform 0.3s ease-in-out;
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
			z-index: 10;

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
