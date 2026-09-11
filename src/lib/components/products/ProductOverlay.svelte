<script lang="ts">
	let {
		isEnlarged,
		isFirefox,
		onToggleEnlargement
	}: {
		isEnlarged: boolean;
		isFirefox: boolean;
		onToggleEnlargement: (e?: MouseEvent | KeyboardEvent) => void;
	} = $props();
</script>

{#if isEnlarged}
	<button
		class="overlay {isFirefox ? 'firefox-overlay' : ''}"
		onclick={onToggleEnlargement}
		onkeydown={(e) => e.key === 'Enter' && onToggleEnlargement()}
		aria-label="Close enlarged view"
	></button>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 8;
		cursor: pointer;
	}

	/* Firefox specific overlay fix */
	:global(.firefox-browser) + .overlay {
		z-index: 9998 !important;
		background-color: rgba(0, 0, 0, 0.5) !important;
	}

	@media (prefers-reduced-motion: no-preference) {
		/* Animation for overlay */
		.overlay {
			animation: fadeIn 0.5s ease 0.15s both;
		}

		@keyframes fadeIn {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
	}
</style>
