<script lang=ts>
	import { createEventDispatcher } from 'svelte'
	import CloseX from '$lib/icons/close-x.svelte'
	import { browser } from '$app/environment'

	const dispatch = createEventDispatcher()
	export let showModal:boolean

	let dialog:HTMLDialogElement

	$: {
		if (dialog && dialog.showModal && showModal) {
			if (browser) bodyStyles()
			dialog.showModal()
		}
		if (dialog && dialog.close && !showModal) {
			if (browser) undoBodyStyles()
			dialog.close()
		}
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
<dialog
	class:active={showModal}
	bind:this={dialog}
	on:close={closeModal}
	on:click|self={closeModal}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal_inner" class:active={showModal} on:click|stopPropagation>
		<!-- svelte-ignore a11y-autofocus -->
		<button class=close_btn autofocus on:click|preventDefault={closeModal}><CloseX /></button>
		<slot />
	</div>
</dialog>

<style lang=postcss>
	@import '@styles/mediaQueries.pcss';

	dialog {
		background-color: transparent;
		border: none;
		width: 100vw;
		height: 100vh;

		padding: 0;
		position: fixed;

		display: none;
		justify-content: center;
		align-items: center;

		&.active {
			display: flex;
		}

		&::backdrop {
			background-color: var(--color-slate-900);
			opacity: .9;
		}

		.modal_inner {
			position: relative;
			padding: var(--size-7) var(--size-4) var(--size-4);

			width: auto;
			max-width: 360px;
			border-radius: var(--radius-xl);
			background-color: var(--color-slate-700);
			border: 4px solid var(--color-blue-200);
			color: var(--color-white);

			@media (--md) {
				/* width: 80px; */
				max-width: 600px;
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
