<script lang="ts">
	import type { LayoutData } from './$types'
	import { SvelteToast } from '@zerodevx/svelte-toast'

	const options = {}
	interface Props {
		data: LayoutData
		children?: import('svelte').Snippet
	}

	let { data, children }: Props = $props()
</script>

<div class="top_area">
	<div class="bar container">
		<div class="user_area">
			<span>Hello, {data.user.name}👋</span>
		</div>
	</div>
</div>

{@render children?.()}

<SvelteToast {options} />

<style lang="postcss">
	/* @import '@styles/mediaQueries.pcss'; */

	.top_area {
		height: 48px;

		.bar {
			position: absolute;
			padding-top: var(--size-4);
			padding-bottom: var(--size-4);

			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
	}
</style>
