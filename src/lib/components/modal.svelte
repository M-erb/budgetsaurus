<script lang=ts>
	import { createEventDispatcher } from 'svelte'
	import CloseX from '$lib/icons/close-x.svelte'
	import { browser } from '$app/environment'

	const dispatch = createEventDispatcher()
	export let showModal:boolean

	$: {
		if (showModal && browser) bodyStyles()
		if (!showModal && browser) undoBodyStyles()
	}

	function closeModal () {
		showModal = false
		dispatch('close')
	}

	function bodyStyles () {
		const body = document.querySelector('body')
		body?.classList.add('modal-open')
	}

	function undoBodyStyles () {
		const body = document.querySelector('body')
		body?.classList.remove('modal-open')
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="Modal"
	class:active={showModal}
	on:close={closeModal}
	on:click|self={closeModal}
	aria-roledescription="dialog"
	aria-modal="true"
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal_inner" class:active={showModal} on:click|stopPropagation>
		<!-- svelte-ignore a11y-autofocus -->
		<button class=close_btn autofocus on:click|preventDefault={closeModal}><CloseX /></button>
		<slot />
	</div>
</div>

<style lang=postcss>
	@import '@styles/mediaQueries.pcss';

	.Modal {
		background-color: transparent;
		border: none;
		min-width: calc(100vw - 32px);
		max-width: calc(100vw - 32px);
		min-height: calc(100vh - 32px);
		margin: 16px;

		padding: 0;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 999;

		display: none;
		justify-content: center;
		align-items: center;

		&.active {
			display: flex;
		}

		&::before {
			content: "";
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: -1;
			background-color: var(--color-slate-900);
			opacity: .9;
		}

		.modal_inner {
			position: relative;
			padding: var(--size-7) var(--size-5) var(--size-5);

			width: auto;
			max-height: calc(100vh - 32px);
			overflow: auto;
			max-width: calc(100vh - 32px);
			border-radius: var(--radius-xl);
			background-color: var(--color-slate-700);
			border: 4px solid var(--color-blue-200);
			color: var(--color-white);

			@media (--md) {
				max-width: 80%;
			}
		}

		&[open] {
			animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		}

		&[open]::backdrop {
			animation: fade 0.2s ease-out;
		}

		.close_btn {
			position: absolute;
			top: var(--size-2);
			right: var(--size-2);
			background-color: transparent;
			border: none;
			padding: 0;
			color: var(--color-slate-200);
			cursor: pointer;
			transition: color .3s ease-in-out;

			&:hover {
				color: var(--color-red-200);
			}
		}
	}
</style>
