<script lang="ts">
	import { browser } from '$app/environment';
	import VerticalTitle from '$lib/components/layout/VerticalTitle.svelte';
	import type { GalleryImage } from '$lib/types';
	import galleryImages from './photoGallery.json';

	let { images: sanityImages = [] }: { images: GalleryImage[] } = $props();
	const images = $derived(sanityImages.length ? sanityImages : (galleryImages as GalleryImage[]));
	let currentSlide = $state(0);
	let supportsViewTransitions = $state(false);

	// Function to handle slide change
	function changeSlide(index: number) {
		// Use View Transition API if available
		if (supportsViewTransitions) {
			document.startViewTransition(() => {
				updateSlide(index);
			});
		} else {
			// Fallback for browsers without view transition support
			updateSlide(index);
		}

		// Announce slide change to screen readers
		announceSlideChange(index);
	}

	// Function to announce slide changes to screen readers
	function announceSlideChange(index: number) {
		const announcer = document.getElementById('slide-announcer');
		if (announcer) {
			const slideNumber = index + 1;
			const total = images.length;
			const title = images[index]?.title || `Image ${slideNumber}`;
			announcer.textContent = `Showing slide ${slideNumber} of ${total}: ${title}`;
		}
	}

	// Separate function to update slide state
	function updateSlide(index: number) {
		if (index < 0) {
			currentSlide = images.length - 1;
		} else if (index >= images.length) {
			currentSlide = 0;
		} else {
			currentSlide = index;
		}

		// Update URL hash without scrolling
		const id = images[currentSlide].id;
		history.replaceState(null, '', `#${id}`);
	}

	// Keyboard navigation handler
	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowLeft':
				event.preventDefault();
				changeSlide(currentSlide - 1);
				break;
			case 'ArrowRight':
				event.preventDefault();
				changeSlide(currentSlide + 1);
				break;
			case 'Home':
				event.preventDefault();
				changeSlide(0);
				break;
			case 'End':
				event.preventDefault();
				changeSlide(images.length - 1);
				break;
			default:
				return;
		}
	}

	// Function to find slide index by ID
	function findSlideIndexById(id: string): number {
		return images.findIndex((image) => image.id === id);
	}

	// Function to navigate to slide by ID
	function navigateToSlide(id: string) {
		const index = findSlideIndexById(id);
		if (index !== -1) {
			changeSlide(index);
		}
	}

	// Handle URL hash changes
	function handleHashChange() {
		const hash = window.location.hash;
		if (hash) {
			const slideId = hash.substring(1); // Remove the # character
			navigateToSlide(slideId);
		}
	}

	$effect(() => {
		// Check for view transition support
		supportsViewTransitions = browser && 'startViewTransition' in document;

		// Check for hash on initial load
		handleHashChange();

		// Listen for hash changes
		window.addEventListener('hashchange', handleHashChange);

		// Auto-focus the keyboard handler for immediate arrow key navigation
		// Use preventScroll to avoid scrolling the page when focusing
		const keyboardHandler = document.querySelector<HTMLElement>('.carousel-keyboard-handler');
		if (keyboardHandler) {
			keyboardHandler.focus({ preventScroll: true });
		}

		// Announce the initial slide after a brief delay
		setTimeout(() => {
			announceSlideChange(currentSlide);
		}, 500);

		// Clean up on component destroy
		return () => {
			window.removeEventListener('hashchange', handleHashChange);
		};
	});
</script>

<VerticalTitle title="Gallery" />

<main class="carousel" role="region" aria-roledescription="carousel" aria-label="Product gallery">
	<!-- Screen reader announcements for slide changes -->
	<div id="slide-announcer" aria-live="polite" aria-atomic="true" class="visually-hidden"></div>

	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="carousel-keyboard-handler"
		tabindex="0"
		onkeydown={handleKeydown}
		role="application"
		aria-label="Gallery keyboard navigation - use arrow keys to navigate"
	>
		<span class="visually-hidden"
			>Use left and right arrow keys to navigate between slides, Home for first slide, End for last
			slide</span
		>

		<div class="carousel-container">
			<div
				class="carousel-slides"
				aria-live="polite"
				style="transform: translateX(-{currentSlide * 100}%)"
			>
				{#each images as image, i}
					<div
						id="slide-{image.id}"
						class="carousel-slide"
						role="group"
						aria-roledescription="slide"
						aria-label="Slide {i + 1} of {images.length}"
						aria-hidden={currentSlide !== i}
					>
						<img src={image.src} alt={image.alt || `Product image ${i + 1}`} />

						{#if image.title}
							<div
								class="slide-title"
								style={supportsViewTransitions
									? `view-transition-name: slide-title-${currentSlide === i ? 'active' : i}`
									: ''}
							>
								{image.title}
							</div>
						{/if}
					</div>
				{/each}
			</div>

			{#if images.length > 1}
				<div class="carousel-controls" id="carousel-controls" tabindex="-1">
					<button
						class="prev-slide"
						aria-label="Previous slide"
						onclick={() => changeSlide(currentSlide - 1)}
						onkeydown={handleKeydown}
						type="button"
					>
						❮
					</button>

					<button
						class="next-slide"
						aria-label="Next slide"
						onclick={() => changeSlide(currentSlide + 1)}
						onkeydown={handleKeydown}
						type="button"
					>
						❯
					</button>
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
	.carousel {
		max-width: 1200px;
		width: 100%;
		height: 100dvh;
		margin-inline: auto;
		position: relative;
		overflow: hidden;
		padding-bottom: 5em;

		&:focus {
			outline: 2px solid var(--color-secondary);
			outline-offset: 2px;
		}

		/* Keyboard handler styles */
		& .carousel-keyboard-handler {
			width: 100%;
			height: 100%;
			position: relative;
			outline: none;
		}

		@media (width >= 1024px) {
			height: calc(100dvh + 5em);
			padding-bottom: 6em;
			margin-bottom: 2em;
		}

		@media (width <= 500px) {
			height: 70dvh;
		}

		& .carousel-container {
			width: 100%;
			position: relative;

			& .carousel-slides {
				display: flex;
				width: 100%;
				transition: transform 0.5s ease-in-out;

				& .carousel-slide {
					min-width: 100%;
					box-sizing: border-box;
					position: relative;
					height: 70vh;
					display: flex;
					align-items: center;
					justify-content: center;
					overflow: hidden;

					& img {
						width: 100%;
						height: auto;
						display: block;
						object-fit: contain;
						max-height: 70vh;
					}

					& .slide-title {
						position: absolute;
						top: 0;
						left: 0;
						right: 0;
						width: fit-content;
						margin-inline: auto;
						background-color: var(--color-primary);
						color: var(--color-dark);
						padding: 0.5rem 0.75rem;
						border: 1px solid var(--color-dark);
						border-radius: var(--radius);
						text-align: center;
						font-family: var(--font-bold);
						font-size: clamp(var(--h6), 2.5vw, var(--h4));
						letter-spacing: 2px;
						opacity: 1;

						@media (width <= 500px) {
							padding: 0.15rem 0.5rem;
						}
					}
				}
			}

			& .carousel-controls {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				pointer-events: none;
				z-index: 3;
			}

			& .prev-slide,
			& .next-slide {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				padding: 0.75rem 1rem;
				background: var(--color-dark);
				color: white;
				cursor: pointer;
				border-radius: 10%;
				font-size: clamp(1rem, 2vw, 2rem);
				z-index: 4;
				pointer-events: auto;
				border: none;

				&:focus {
					outline: 2px solid var(--color-dark);
					outline-offset: 2px;
				}
			}

			& .prev-slide {
				left: 10px;
			}

			& .next-slide {
				right: 10px;
			}
		}
	}

	/* View Transition Animations */
	@supports (view-transition-name: none) {
		::view-transition-old(slide-title-active),
		::view-transition-new(slide-title-active) {
			animation-duration: 0.75s;
			animation-timing-function: ease-in-out;
		}

		::view-transition-old(slide-title-active) {
			animation-name: slide-title-out;
		}

		::view-transition-new(slide-title-active) {
			animation-name: slide-title-in;
		}
	}

	/* Fallback for browsers without view transition support */
	@supports not (view-transition-name: none) {
		[style*='view-transition-name: slide-title'] {
			transition:
				opacity 0.5s ease,
				transform 0.5s ease !important;
			animation: none !important;
		}
	}

	@keyframes slide-title-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
			scale: 0;
		}
	}

	@keyframes slide-title-in {
		from {
			opacity: 0;
			scale: 0.5;
		}
		to {
			opacity: 1;
			scale: 1;
		}
	}
</style>
