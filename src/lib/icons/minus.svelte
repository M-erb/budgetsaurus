<script lang="ts">
	interface Props {
		[key: string]: any
	}

	let { ...props }: Props = $props()
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 448 512" {...props}>
	<path
		fill="currentColor"
		d="M432 256c0 17.7-14.3 32-32 32H48c-17.7 0-32-14.3-32-32s14.3-32 32-32h352c17.7 0 32 14.3 32 32" />
</svg>
