<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import SEO from '$lib/data/SEO.svelte';
</script>

<SEO
	title="Error &middot; Busy Little Bat Sewing"
	description="An error occurred while processing your request. Please try again later."
	keywords="error, busy little bat sewing error, error page, 404, 500"
/>

<main aria-label="error" transition:fade={{ duration: 300, delay: 100 }}>
	<div class="error">
		<h2>There was an error</h2>

		<h1>{$page.status}</h1>
	</div>

	<div class="error">
		<p>{$page.error?.message ?? 'An unexpected error occurred.'}</p>
	</div>
</main>

<style>
	main {
		padding: 1rem 1.5rem;
		height: 80vh;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		h1 {
			font-size: clamp(2rem, 5vw, 6rem);
			font-weight: 900;
			margin-inline: auto;
			text-align: center;
			color: var(--color-info);
			font-family: var(--font-semibold);
			letter-spacing: 7px;
			text-shadow: 5px 7.5px 5px var(--color-gray);
			text-wrap: balance;
		}

		h2 {
			font-size: clamp(1.5rem, 2.5vw, 3rem);
			font-weight: 700;
			margin-inline: auto;
			margin-block: 0;
			text-align: center;
			color: var(--color-secondary);
			font-family: var(--font-title);
			letter-spacing: 5px;
			text-wrap: balance;
		}

		p {
			font-family: var(--font-regular);
			font-size: clamp(1.75rem, 3vw, 2rem);
			font-weight: 500;
			letter-spacing: 5px;
			line-height: 1.25;
			text-align: left;
			padding: 2rem 4rem;
			color: var(--text-color);
			text-align: center;
			text-shadow: 1px 1px 5px var(--color-gray);
			text-wrap: none;
			margin-bottom: 3%;
		}

		.error {
			width: 100%;
		}
	}
</style>
