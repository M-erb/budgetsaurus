<script lang=ts>
	import type { ActionData } from './$types'
	import { enhance } from '$app/forms'

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();
</script>

<section class="container_sm">
	<h1>Budgetsaurus</h1>
	<div class="sub_area form_wrap">
		{#if form?.success === false}
			<div class="alert __err">
				<p class="">{form?.message}</p>
			</div>
		{/if}
		<form method="POST" action="?/login" use:enhance>
			<label>
				<span class="label">Email</span>
				<input name="email" type="email">
			</label>
			<label>
				<span class="label">Password</span>
				<input name="pass" type="password">
			</label>

			<div class="btn_wrap __right">
				<button class=btn>Log in</button>
				<!-- <button class=btn formaction="?/register">Register</button> -->
			</div>
		</form>
	</div>
</section>

<style lang="postcss">
	@import '@styles/mediaQueries.pcss';

	h1 {
		text-align: center;
	}

	.form_wrap {
		margin-top: var(--size-12);
		max-width: 500px;
		margin-right: auto;
		margin-left: auto;

		.alert {
			margin-bottom: var(--size-4);
		}

		.btn_wrap {
			margin-top: var(--size-12);
		}
	}
</style>
