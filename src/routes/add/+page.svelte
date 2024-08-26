<script lang="ts">
	let a = 0
	let b = 0
	let total = 0

	async function add (e:Event) {
		e.preventDefault()
		const response = await fetch('/add', {
			method: 'POST',
			body: JSON.stringify({ a, b }),
			headers: {
				'content-type': 'application/json',
			},
		})

		total = await response.json()
	}
</script>

<section class="container">
	<input type="number" bind:value={a}> + <input type="number" bind:value={b}> = {total}
	<br>
	<br>
	<button on:click={add}>Calculate</button>
</section>
