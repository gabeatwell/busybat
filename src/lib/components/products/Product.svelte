<script lang="ts">
	import { browser } from '$app/environment';
	import {
		createToggleDropdownHandler,
		createToggleEnlargementHandler,
		createHandleDropdownState,
		createDropdownHandlers,
		trapFocus
	} from './productFunctions.svelte';
	import {
		createBrowserDetection,
		createCartState,
		createAddToCartHandler,
		createSelectHandlers,
		createAccessibilityHelpers
	} from './uiFunctions.svelte';
	import ProductDropdown from './ProductDropdown.svelte';
	import ProductImage from './ProductImage.svelte';
	import ProductInfo from './ProductInfo.svelte';
	// import ProductActions from './ProductActions.svelte';
	import SquareLink from './SquareLink.svelte';
	import ProductOverlay from './ProductOverlay.svelte';
	import type { AddToCartFn, AddToCartHandler } from '$lib/types';

	let {
		id,
		name,
		price,
		description,
		imageUrl,
		rating,
		inStock,
		context = 'default',
		productUrl,
		dropdown,
		dropdownImage,
		category,
		imageFit = 'cover',
		addToCart,
		style = ''
	}: {
		id: string;
		name: string;
		price: number;
		description: string;
		imageUrl: string;
		rating?: number;
		inStock: boolean;
		context?: string;
		productUrl: string;
		dropdown?: string;
		dropdownImage?: string;
		category?: string;
		imageFit?: string;
		addToCart?: AddToCartFn;
		style?: string;
	} = $props();

	// State variables
	let isEnlarged = $state(false);
	let isDropdownOpen = $state(false);
	let isDropdownOpened = $state(false);
	let isTransitioning = $state(false);

	// Initialize browser detection
	const browserDetection = createBrowserDetection();
	let supportsViewTransitions = $state(false);
	let isFirefox = $state(false);

	// Initialize cart state management
	const cartState = createCartState(id);

	// Product data for cart - make it reactive to include selected size
	let productData = $derived({
		id,
		name,
		price,
		imageUrl,
		productUrl,
		quantity: 1,
		...(cartState.selectedSize && { size: cartState.selectedSize })
	});
	let addToCartHandler = $state<AddToCartHandler | null>(null);

	const selectHandlers = createSelectHandlers(id, cartState);
	const accessibilityHelpers = createAccessibilityHelpers();
	const dropdownHandlers = createDropdownHandlers();

	async function handleAddToCart(e: MouseEvent) {
		if (addToCartHandler) {
			await addToCartHandler.handleAddToCart(e, addToCart ?? (() => {}), toggleEnlargement);
		}
	}

	const toggleDropdown = createToggleDropdownHandler({
		isDropdownOpen: (val?: boolean) =>
			val !== undefined ? (isDropdownOpen = val) : isDropdownOpen,
		id: () => id
	});

	const toggleEnlargement = createToggleEnlargementHandler(
		{ id, context },
		{
			isEnlarged: (val?: boolean) => {
				if (val !== undefined) {
					isTransitioning = true;
					isEnlarged = val;

					if (!val) {
						isDropdownOpen = false;
						isDropdownOpened = false;
					}

					setTimeout(
						() => {
							isTransitioning = false;
							if (isEnlarged) {
								const productInfo = document.querySelector<HTMLElement>(
									'.product-card.enlarged .product-info'
								);
								if (productInfo) {
									productInfo.scrollTop = 0;
								}
							}
						},
						isFirefox ? 300 : 750
					);
				}
				return isEnlarged;
			},
			isDropdownOpen: (val?: boolean) =>
				val !== undefined ? (isDropdownOpen = val) : isDropdownOpen
		}
	);

	let handleDropdownState = $derived(() => {
		return (isOpen: boolean) => {
			dropdownHandlers.handleDropdownState(
				isOpen,
				id,
				isEnlarged,
				isFirefox,
				supportsViewTransitions
			);
		};
	});

	$effect(() => {
		// run detection for browser features
		browserDetection.detectBrowser();
		supportsViewTransitions = browserDetection.supportsViewTransitions;
		isFirefox = browserDetection.isFirefox;

		addToCartHandler = createAddToCartHandler(id, productData, cartState);

		cartState.updateCartState();
	});

	// Enlargement state management
	$effect(() => {
		if (isTransitioning) return;

		if (isEnlarged) {
			document.body.classList.add('product-enlarged');

			// Add global escape key listener
			function handleGlobalKeydown(e: KeyboardEvent) {
				if (e.key === 'Escape' && isEnlarged) {
					e.preventDefault();
					toggleEnlargement();
				}
			}
			// Mobile-specific: Close on background tap
			function handleBackgroundTouch(e: MouseEvent) {
				if (
					e.target instanceof HTMLElement &&
					e.target.classList.contains('product-overlay') &&
					isEnlarged
				) {
					toggleEnlargement();
				}
			}
			document.addEventListener('keydown', handleGlobalKeydown);
			document.addEventListener('click', handleBackgroundTouch);

			// Screen reader announcement
			const cleanDescription = description.replace(/<[^>]*>/g, '').trim();
			accessibilityHelpers.createScreenReaderAnnouncement(
				`Product details for ${name} expanded. ${cleanDescription}. Press Escape to close.`
			);

			// Handle navigation elements
			accessibilityHelpers.hideNavElements();

			// Immediately reset scroll when enlarged
			accessibilityHelpers.scrollProductInfoToTop();

			// Handle select elements and scroll to top
			setTimeout(() => {
				const card = document.querySelector<HTMLElement>('.product-card.enlarged');
				if (card) {
					trapFocus(card);
					card.style.zIndex = '10';
				}

				// Force scroll to top of the product info content
				accessibilityHelpers.scrollProductInfoToTop();

				// Setup select listeners
				selectHandlers.setupSelectListeners();

				// Additional delayed scroll reset to ensure content starts at top
				setTimeout(() => {
					accessibilityHelpers.scrollProductInfoToTop();
				}, 100);
			}, 0);

			// Cleanup function
			return () => {
				document.removeEventListener('keydown', handleGlobalKeydown);
				document.removeEventListener('click', handleBackgroundTouch);
			};
		} else {
			// Cleanup select listeners
			selectHandlers.cleanupSelectListeners();

			if (document.body.classList.contains('product-enlarged')) {
				accessibilityHelpers.createScreenReaderAnnouncement(
					'Product details closed. Returned to product grid.'
				);
			}

			document.body.classList.remove('product-enlarged');

			const card = document.querySelector<HTMLElement>(`.product-card.product-id-${id}`);
			if (card) {
				card.style.removeProperty('z-index');
				card.style.removeProperty('position');
			}

			const enlargedCard = document.querySelector<HTMLElement>('.product-card.enlarged');
			if (enlargedCard) {
				enlargedCard.style.removeProperty('z-index');
			}

			// Show navigation elements
			accessibilityHelpers.showNavElements();

			// Show other products
			accessibilityHelpers.showOtherProducts(id, context, isFirefox, supportsViewTransitions);
		}
	});
</script>

<div
	class="product-card {isEnlarged ? 'enlarged' : ''} product-id-{id} {isFirefox
		? 'firefox-browser'
		: ''}"
	style="{style}{supportsViewTransitions && !isFirefox
		? `; view-transition-name: ${context}-product-card-${id}`
		: ''}"
	onclick={toggleEnlargement}
	onkeydown={(e) => {
		if (e.target === e.currentTarget) {
			if (e.key === 'Enter') toggleEnlargement();
			if (e.key === 'Escape' && isEnlarged) toggleEnlargement();
		}
	}}
	aria-label={isEnlarged
		? `${name} - ${description.replace(/<[^>]*>/g, '')}`
		: `View product details for ${name}`}
	aria-describedby={isEnlarged ? `product-description-${id}` : null}
	aria-expanded={isEnlarged}
	role="button"
	tabindex="0"
>
	<ProductImage
		{imageUrl}
		{name}
		{inStock}
		{context}
		{id}
		{imageFit}
		{category}
		{supportsViewTransitions}
		{isFirefox}
	/>

	<div class="product-info">
		<ProductInfo
			{name}
			{price}
			{description}
			{id}
			{isEnlarged}
			{context}
			{supportsViewTransitions}
			{isFirefox}
		/>

		{#if isEnlarged}
			<ProductDropdown
				{id}
				{name}
				{isEnlarged}
				onClose={toggleEnlargement}
				onStateChange={handleDropdownState}
				dropdownImage={dropdown ?? dropdownImage}
			/>

			<!-- <ProductActions
				{inStock}
				isLoading={addToCartHandler?.isLoading || false}
				isAddedToCart={cartState.isAddedToCart}
				{isEnlarged}
				onAddToCart={handleAddToCart}
				onToggleEnlargement={toggleEnlargement}
			/> -->

			<SquareLink />
		{/if}
	</div>
</div>

<ProductOverlay {isEnlarged} {isFirefox} onToggleEnlargement={toggleEnlargement} />

<style>
	/* For browsers without view transition support, use fallback animation */
	@supports not (view-transition-name: none) {
		.product-card.enlarged {
			animation: enlarge 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
			z-index: 999 !important;
			background-color: white !important;
		}
	}

	/* For browsers with view transition support */
	@supports (view-transition-name: none) {
		.product-card.enlarged {
			animation: enlarge 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
		}

		/* Product name view transition animations */
		::view-transition-old(*product-name*),
		::view-transition-new(*product-name*) {
			animation-duration: 1s;
			animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
		}

		/* Smooth font size and layout changes */
		::view-transition-group(*product-name*) {
			animation-duration: 1s;
			animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
		}

		/* Product image view transition animations */
		::view-transition-old(*product-image*),
		::view-transition-new(*product-image*) {
			animation-duration: 0.5s;
			animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
		}

		/* Smooth image size and layout changes */
		::view-transition-group(*product-image*) {
			animation-duration: 0.5s;
			animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
		}
	}

	/* Enhanced animations for view transition supporting browsers with motion preference */
	@supports (view-transition-name: none) {
		@media (prefers-reduced-motion: no-preference) {
			::view-transition-old(root),
			::view-transition-new(root) {
				animation-delay: 0s;
				animation-duration: 0.75s;
			}

			/* Target specific product card view transitions */
			::view-transition-group(*product-card*) {
				animation-delay: 0s;
				animation-duration: 0.75s;
				animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
			}

			/* Target the old and new states of product card transitions */
			::view-transition-old(*product-card*),
			::view-transition-new(*product-card*) {
				animation-delay: 0s;
				animation-duration: 0.75s;
				animation-timing-function: cubic-bezier(0.2, 0, 0.2, 1);
			}
		}
	}

	/* Fallback animations for browsers without view transition support but with motion preference */
	@supports not (view-transition-name: none) {
		@media (prefers-reduced-motion: no-preference) {
			.product-card.enlarged {
				animation: enlarge 0.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
			}
		}
	}

	/* Specific styles for the mini menace product (id 1) */
	:global(.product-id-1 .dropdown-container .toggle-wrapper) {
		position: absolute;
		top: -1rem;
		right: 0;
		z-index: 2;
	}

	:global(.product-id-1 .dropdown-toggle) {
		position: absolute;
		z-index: 3;
	}

	/* Make sure the D. Harry product works too */
	:global(.product-id-2 .dropdown-container),
	:global(.product-id-2 .dropdown-toggle) {
		z-index: 2;
	}

	:global(::view-transition-group(*product-card*)) {
		z-index: 9;
	}

	/* Additional fallback for body class targeting */
	:global(body.view-transitions-not-supported) .product-card.enlarged {
		z-index: 999 !important;
		background-color: white !important;
	}

	/* Screen reader only content */
	:global(.visually-hidden) {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	.product-card {
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.7s cubic-bezier(0.25, 1, 0.5, 1),
			box-shadow 0.7s cubic-bezier(0.25, 1, 0.5, 1),
			opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1);
		width: 100%;
		height: auto;
		position: relative;
		cursor: pointer;
		z-index: 1;
		will-change: transform, opacity;
		transform: translateZ(0);
		background-color: hsl(0, 0%, 100%);
		margin-top: 1em;

		&:hover {
			transform: translateY(-5px);
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		}

		&:not(.enlarged):hover {
			transform: translateY(-5px);
			box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
		}

		&.enlarged {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 50%;
			max-width: 800px;
			height: 80vh;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			z-index: 9;
			cursor: default;
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
			background-color: hsl(0, 0%, 100%);

			@media (width <= 768px) {
				width: 90%;
				height: 90vh;
				display: flex;
				flex-direction: column;
				overflow: hidden;
				top: 50%;
				transform: translate(-50%, -50%);
				margin: 0;
				z-index: 10;

				& .product-info {
					flex: 1;
					overflow-y: auto;
					-webkit-overflow-scrolling: touch;
				}

				& :global(.product-image) {
					flex-shrink: 0;
					max-height: 200px;
				}
			}
		}

		&.firefox-browser.enlarged {
			z-index: 9999 !important;
			background-color: white !important;
			position: fixed !important;
			top: 50% !important;
			left: 50% !important;
			transform: translate(-50%, -50%) !important;
			animation: firefox-enlarge 0.3s ease forwards !important;
		}
	}

	.product-card.enlarged :global(.product-image) {
		flex-shrink: 0;
	}

	.product-info {
		display: grid;
		grid-template-rows: auto auto auto 1fr auto;
		gap: 0.5rem;
		padding: 1rem;
		scroll-behavior: instant;

		.enlarged & {
			flex: 1;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			overscroll-behavior: contain;
			padding: 1rem;
			padding-bottom: 2rem;
			display: grid;
			grid-template-rows: auto auto auto 1fr auto;
			gap: 1rem;
			scroll-padding-top: 1rem;
			scroll-behavior: auto;
			scrollbar-gutter: stable;
		}
	}

	@keyframes enlarge {
		0% {
			transform: translate(-50%, -50%) scale(0.9);
			opacity: 0.7;
		}
		100% {
			transform: translate(-50%, -50%);
			opacity: 1;
		}
	}

	@keyframes firefox-enlarge {
		0% {
			transform: translate(-50%, -50%) scale(0.9);
			opacity: 0.7;
		}
		100% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 1;
		}
	}
</style>
