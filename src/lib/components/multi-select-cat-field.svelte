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

	export let value: cat[] = []
	export let cats: cat[]

	let active = false
	let searchTxt: string = ''
	let filteredCats: cat[]

	$: filteredCats = cats.filter(cat => cat.name.toLocaleLowerCase().includes(searchTxt.toLocaleLowerCase()))

	function select (cat: cat) {
		const foundIndex = value.findIndex(item => cat.id === item.id)

		if (foundIndex > -1) value.splice(foundIndex, 1)
		else value.push(cat)

		value = value
	}

	onMount(() => {
		filteredCats = structuredClone(cats)
	})

	function handleKey (e:KeyboardEvent) {
		if (e.key === 'ArrowDown') active = true
	}
</script>

<div class="select_field_area" class:active on:blur={() => active = !active}>
	<span class="label">Category</span>

	<button
		class="select_field"
		type="button"
		on:click={() => active = !active}
		on:keydown={handleKey}
	>
		<div class="name_area">
			{#if value.length}
				{#if value.length === 1}
					<div class="color" style:background-color={ value[0].color }></div>
				{/if}
				<span class="selected_value">{ value.length === 1 ? `${value[0].name}` : `${value.length} Selected` }</span>
				{:else} <span class="selected_value">Select a Category</span>
			{/if}
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
			{@const isSelected = value.some(item => cat.id === item.id)}
			<li class="option">
				<button type="button" on:click|preventDefault={() => select(cat)}>
					<div class="check" class:active={isSelected}></div>
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

				.check {
					background-color: #f9fafb29;
					border: 2px solid var(--color-slate-300);
					border-radius: var(--radius-sm);
					width: 24px;
					height: 24px;
					position: relative;

					&::after {
						content: '';
						display: none;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						background-color: var(--color-slate-400);
						border-radius: var(--radius-sm);
						width: 12px;
						height: 12px;
					}

					&.active::after {
						display: block;
					}
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
