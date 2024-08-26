<script lang="ts">
  import type { PageServerData } from './$types'

	export let data:PageServerData
  console.log('data: ', data)
</script>

<section class="container">
  <h1>Welcome to the app! {JSON.stringify(data)}</h1>
</section>
