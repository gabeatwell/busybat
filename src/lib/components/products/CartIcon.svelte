<script lang="ts">
	import { getCartData } from './CartStore.svelte';
	import type { CartItem } from '$lib/types';

	// Accept class, onclick, and navOpen props
	let {
		class: className = '',
		onclick = undefined,
		navOpen = false
	}: {
		class?: string;
		onclick?: (e: MouseEvent) => void;
		navOpen?: boolean;
	} = $props();

	// Get cart data from the store
	let cart = $state<CartItem[]>([]);
	$effect(() => {
		const data = getCartData();
		cart = data.cart;
	});

	// Calculate total items in cart
	let itemCount = $derived(cart.reduce((total, item) => total + (item.quantity || 0), 0));

	// Previous count for comparison
	let previousCount = $state(0);

	// Announce cart changes to screen readers
	$effect(() => {
		if (itemCount !== previousCount && previousCount !== 0) {
			// Create temporary announcement element
			const announcement = document.createElement('div');
			announcement.setAttribute('aria-live', 'polite');
			announcement.setAttribute('aria-atomic', 'true');
			announcement.className = 'visually-hidden';
			announcement.textContent = `Cart updated. You now have ${itemCount} item${itemCount === 1 ? '' : 's'} in your cart.`;

			document.body.appendChild(announcement);

			// Remove after announcement
			setTimeout(() => {
				document.body.removeChild(announcement);
			}, 1000);
		}
		previousCount = itemCount;
	});
</script>

<a href="/cart" class="cart-icon-wrapper {className}" {onclick}>
	<div class="cart-icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width={navOpen ? '2' : '2'}
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<title>Shopping Cart</title>
			<circle cx="9" cy="21" r="1"></circle>
			<circle cx="20" cy="21" r="1"></circle>
			<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
		</svg>

		{#if itemCount > 0}
			<span class="cart-count" role="status" aria-label="Cart items: {itemCount}">
				{itemCount}
			</span>
		{/if}
	</div>
</a>

<style>
	.cart-icon-wrapper {
		display: inline-flex;
		position: relative;
		color: inherit;
		text-decoration: none;
		justify-content: center;
		align-items: center;
		width: 100%;

		& .cart-icon {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			scale: 1.5;
			transform-origin: center;
			margin: 0;
			padding: 0;

			& .cart-count {
				position: absolute;
				top: -6px;
				right: -6px;
				background: var(--color-danger);
				color: white;
				border-radius: 50%;
				width: 1rem;
				height: 1rem;
				font-size: clamp(var(--xs), 1vw, var(--xs));
				display: grid;
				place-items: center;
				font-weight: bold;
				line-height: 0;
				padding: 0;
				box-sizing: border-box;

				@media (width <= 500px) {
					width: 1.1rem;
					height: 1.1rem;
					line-height: 0;
					display: flex;
					align-items: center;
					justify-content: center;

					&::before {
						content: '\200A'; /* Unicode for hair space */
					}
				}
			}
		}
	}

	@keyframes pop {
		0% {
			transform: scale(0);
		}
		70% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
