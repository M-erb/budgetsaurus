<script lang=ts>
	import '@fontsource/fira-sans/400.css'
	import '@fontsource/fira-sans/700.css'
	import '@fontsource/fira-sans/900.css'
	import '@fontsource/fira-sans/400-italic.css'
	import '@fontsource/fira-sans/700-italic.css'
	import '@fontsource/fira-sans/900-italic.css'
	import '@fontsource/ubuntu-mono/400.css'
	import '@fontsource/ubuntu-mono/400-italic.css'
	import '@styles/main.pcss'
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="page">
	{@render children?.()}
</div>
