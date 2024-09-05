<script>
	import '@fontsource/fira-sans/400.css'
	import '@fontsource/fira-sans/700.css'
	import '@fontsource/fira-sans/900.css'
	import '@fontsource/fira-sans/400-italic.css'
	import '@fontsource/fira-sans/700-italic.css'
	import '@fontsource/fira-sans/900-italic.css'
	import '@fontsource/ubuntu-mono/400.css'
	import '@fontsource/ubuntu-mono/400-italic.css'
	import '@styles/main.pcss'
</script>

<div class="page">
	<slot></slot>
</div>

<style>
	.page {
		margin-bottom: var(--size-24);
	}
</style>