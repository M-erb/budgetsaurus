<script lang="ts">
	interface Props {
		[key: string]: any
	}

	let { ...props }: Props = $props()
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 12 12" {...props}>
	<path
		fill="currentColor"
		d="M6 4c-.2 0-.4.1-.5.2L2.2 7.5c-.3.3-.3.8 0 1.1s.8.3 1.1 0L6 5.9l2.7 2.7c.3.3.8.3 1.1 0s.3-.8 0-1.1L6.6 4.3Q6.3 4 6 4" />
</svg>
