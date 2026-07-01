<script>
	import '../app.css';
	// import { page } from '$app/stores';
	import ViewTransition from '$lib/components/layout/ViewTransition.svelte';
	import Nav from '$lib/components/navigation/Nav.svelte';
	import Footer from '$lib/components/navigation/Footer.svelte';
	import SkipToMain from '$lib/components/layout/SkipToMain.svelte';
	import LocalStorage from '$lib/components/layout/localStorage.svelte';
	import LoadingSpinner from '$lib/components/layout/LoadingSpinner.svelte';

	let { children } = $props();
	let isPageLoaded = $state(false);

	// Handle page load state
	$effect(() => {
		if (typeof window !== 'undefined') {
			if (document.readyState === 'complete') {
				isPageLoaded = true;
			} else {
				window.addEventListener('load', () => {
					isPageLoaded = true;
				});
			}
		}
	});
</script>

<LocalStorage />
<ViewTransition />
<SkipToMain />

{#if !isPageLoaded}
	<div class="loading-container">
		<LoadingSpinner size="15em" />
	</div>
{/if}

<main>
	<Nav />

	<div class="slot" id="main-content">
		{@render children()}
	</div>

	<Footer year={new Date().getFullYear()} name="Busy Little Bat Sewing." />
</main>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		width: 100%;
		height: 100%;
		min-height: 100vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	main {
		font-family: var(--font-regular);
		background-color: hsl(0, 0%, 100%);
		display: flex;
		flex-direction: column;
		flex: 1 0 auto;
		height: auto;

		& .slot {
			flex: 1 0 auto;
			position: relative;
			margin-block: 1em;
			padding: 1em;
		}
	}

	.loading-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: white;
		z-index: 6;
	}
</style>
