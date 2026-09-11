<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import { browser } from '$app/environment';

	let supportsViewTransitions = $state(false);

	// Export function to check view transition support
	export function hasViewTransitionSupport() {
		return browser && 'startViewTransition' in document;
	}

	$effect(() => {
		// Check for View Transition support and browser type
		try {
			supportsViewTransitions = hasViewTransitionSupport();
		} catch (e) {
			console.warn('Error checking view transition support:', e);
			supportsViewTransitions = false;
		}

		// Add a way to force Firefox mode for testing
		const urlParams = new URLSearchParams(window.location.search);
		const forceFirefoxMode = urlParams.get('firefox') === 'true';

		if (forceFirefoxMode) {
			supportsViewTransitions = false;
			console.log('🦊 Firefox mode forced via URL parameter');
		}

		// Add class to body to indicate support level
		if (browser) {
			if (supportsViewTransitions && !forceFirefoxMode) {
				document.body.classList.add('view-transitions-supported');
				document.body.classList.remove('view-transitions-not-supported');
				console.log('✅ View transitions supported');
			} else {
				document.body.classList.add('view-transitions-not-supported');
				document.body.classList.remove('view-transitions-supported');
				console.log('🔄 View transitions not supported, using fallback animations');
			}
		}
	});

	// view transition
	onNavigate((navigation) => {
		if (!supportsViewTransitions) {
			// For browsers without View Transition support, just resolve immediately
			return;
		}

		return new Promise((resolve) => {
			try {
				const transition = document.startViewTransition(async () => {
					resolve();
					await new Promise((r) => setTimeout(r, 300));
				});

				transition.finished.catch((e) => {
					console.error('Transition failed:', e);
					resolve();
				});
			} catch (e) {
				console.error('Failed to start view transition:', e);
				resolve();
			}
		});
	});
</script>

<style>
	/* Only apply view transition styles when supported */
	@supports (view-transition-name: none) {
		:root {
			view-transition-name: root;
		}
		:root::view-transition-old(root) {
			animation: 0.4s cubic-bezier(0.4, 0, 1, 1) both crossfade-out;
		}

		:root::view-transition-new(root) {
			animation: 0.2s cubic-bezier(0, 0, 0.2, 1) both crossfade-in;
		}

		@supports (-webkit-touch-callout: none) {
			:root::view-transition-old(root) {
				animation: 0.4s cubic-bezier(0.4, 0, 1, 1) both crossfade-out-safari;
			}

			:root::view-transition-new(root) {
				animation: 0.3s cubic-bezier(0, 0, 0.2, 1) both crossfade-in-safari;
			}
		}
	}

	/* Fallback: disable view transition styles for unsupported browsers */
	@supports not (view-transition-name: none) {
		/* Ensure elements with view-transition-name don't have issues */
		:global([style*='view-transition-name']) {
			animation: none !important;
			transition: all 0.3s ease !important;
		}

		/* Provide smooth fallback transitions */
		:global(.product-card) {
			transition:
				transform 0.3s ease,
				opacity 0.3s ease !important;
		}

		:global(.product-card.enlarged) {
			animation: fallback-enlarge 0.5s ease forwards !important;
		}
	}

	/* Global fallback for browsers without view transition support */
	:global(.view-transitions-not-supported [style*='view-transition-name']) {
		animation: none !important;
		transition: all 0.3s ease !important;
	}

	:global(.view-transitions-not-supported .product-card) {
		transition:
			transform 0.3s ease,
			opacity 0.3s ease !important;
	}

	:global(.view-transitions-not-supported .product-card.enlarged) {
		animation: fallback-enlarge 0.5s ease forwards !important;
	}

	@keyframes fallback-enlarge {
		0% {
			transform: translate(-50%, -50%) scale(0.9);
			opacity: 0.7;
		}
		100% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
	}

	@keyframes crossfade-out {
		from {
			opacity: 1;
			transform: scale(1) translateX(0);
		}
		to {
			opacity: 0;
			transform: scale(0.95) translateX(-10px);
		}
	}

	@keyframes crossfade-in {
		from {
			opacity: 0;
			transform: scale(1.05) translateX(10px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateX(0);
		}
	}

	@keyframes crossfade-out-safari {
		from {
			opacity: 1;
		}
		to {
			opacity: 0.65;
		}
	}

	@keyframes crossfade-in-safari {
		from {
			opacity: 0.65;
		}
		to {
			opacity: 1;
		}
	}
</style>
