<script lang=ts>
	interface cat {
		id: number
		note: string|null
		createdAt: Date|null
		color: string
		name: string
	}

	export let value: number
	export let cats: cat[]

	let selected: cat|undefined

	$: selected = value ? cats.find(item => item.id === value) : undefined
</script>

<div class="display_cat">
	<div class="name_area">
		{#if selected}
			<div class="cat_color" style:background-color={selected.color}></div>
		{/if}
		<span class="selected_value">{ selected ? selected.name : 'Select a Category' }</span>
	</div>
</div>

<style lang="postcss">
	/* @import '@styles/mediaQueries.pcss'; */

	.display_cat {
		width: 100%;
		min-width: 200px;
		margin-bottom: var(--size-4);
		font-family: var(--font-body);
		font-size: var(--scale-00);
		color: var(--color-white);
		line-height: 1.4;

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
	}
</style>
