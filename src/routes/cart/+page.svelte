<script lang="ts">
	import SEO from '$lib/data/SEO.svelte';
	import {
		getCartData,
		removeFromCart,
		updateQuantity,
		handleCheckout
	} from '$lib/components/products/CartStore.svelte';
	import type { CartItem } from '$lib/types';

	// Get reactive cart data from the store - use the actual state references
	let cartData = $derived(getCartData());
	let cart = $derived(cartData.cart);
	let customerEmail = $derived(cartData.customerEmail);
	let isProcessingPayment = $derived(cartData.isProcessingPayment);
	// Calculate cart total reactively
	let cartTotal = $derived(
		cart.reduce((sum: number, item: CartItem) => {
			const price = item.price ?? 0;
			const quantity = item.quantity;
			return sum + price * quantity + 10; // Adding $10 shipping per item
		}, 0)
	);

	// Handlers for cart actions
	function handleRemoveItem(id: string, size: string | null = null) {
		removeFromCart(id, size);
	}

	function handleUpdateQuantity(id: string, newQuantity: number, size: string | null = null) {
		updateQuantity(id, newQuantity, size);
	}
</script>

<SEO
	title="Shopping Cart &middot; Busy Little Bat Sewing"
	description="Review your selected items and proceed to checkout. Quality handmade gothic and alternative clothing from Busy Little Bat Sewing."
	keywords="busy little bat sewing shop, busy little bat sewing shopping cart"
/>

<div class="cart-page">
	<h1>Your Cart</h1>

	{#if cart.length === 0}
		<div class="empty-cart">
			<p>Your cart is empty</p>
			<a href="/products" class="continue-shopping">Continue Shopping</a>
		</div>
	{:else}
		<div class="cart-items">
			{#each cart as item (`${item.id}-${item.size || 'no-size'}`)}
				<div class="cart-item">
					<div class="item-image">
						{#if item.imageUrl}
							<img src={item.imageUrl} alt={item.name} />
						{:else}
							<div class="placeholder-image"></div>
						{/if}
					</div>

					<div class="item-details">
						<h3>{item.name}</h3>
						{#if item.size}
							<div class="item-size">
								<span class="label">Size:</span>
								<span class="value">{item.size}</span>
							</div>
						{/if}
						<div class="item-price">
							<span class="label">Price:</span>
							<span class="value">${(item.price ?? 0).toFixed(2)}</span>
						</div>
						<div class="item-price">
							<span class="label">Shipping:</span>
							<span class="value">$10.00</span>
						</div>

						<div class="quantity-controls">
							<button class="remove-btn" onclick={() => handleRemoveItem(item.id, item.size)}
								>Remove</button
							>
						</div>
					</div>

					<div class="item-total">
						<span class="label">Total:</span>
						<p>${((item.price ?? 0) * item.quantity + 10).toFixed(2)}</p>
					</div>
				</div>
			{/each}

			<div class="cart-summary">
				<div class="subtotal">
					<span>Subtotal:</span>
					<span>${cartTotal.toFixed(2)}</span>
				</div>

				<div class="checkout-form">
					<button
						class="checkout-btn"
						onclick={handleCheckout}
						disabled={isProcessingPayment || cart.length === 0}
					>
						{isProcessingPayment ? 'Processing...' : 'Proceed to Checkout'}
					</button>
				</div>

				<a href="/products" class="continue-shopping">Continue Shopping</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.cart-page {
		max-width: 960px;
		margin: 2rem auto;
		padding: 1rem;

		@media (width <= 768px) {
			margin: 1rem auto;
		}

		@media (width <= 500px) {
			padding: 0.5rem;
			margin: 0.5rem auto;
		}

		& .continue-shopping {
			display: inline-block;
			margin-top: 1rem;
			color: var(--color-accent);
			text-decoration: none;
			font-family: var(--font-bold);
			font-size: clamp(var(--sm), 2vw, var(--h4));
			font-weight: 600;
			letter-spacing: 2px;
			transition: color 0.2s ease;

			@media (width <= 500px) {
				letter-spacing: 0;
			}

			&:hover {
				color: hsl(320, 75%, 56%);
			}
		}

		& h1 {
			color: var(--color-accent);
			-webkit-text-stroke: 1px var(--color-secondary);
			font-family: var(--font-title);
			font-size: clamp(var(--h3), 5vw, var(--lg));
			text-align: center;
			letter-spacing: -1px;

			@media (width <= 500px) {
				margin: 0;
			}
		}

		& .empty-cart {
			text-align: center;
			margin: 4rem 0;
			font-family: var(--font-regular);
			font-size: clamp(var(--h6), 2vw, var(--h3));
			font-weight: 500;
		}

		& .cart-items {
			display: flex;
			flex-direction: column;
			gap: 1.5rem;

			@media (width <= 768px) {
				gap: 1rem;
			}

			& .cart-item {
				display: grid;
				grid-template-columns: 120px 1fr auto;
				gap: 1.5rem;
				padding: 1.5rem;
				border: 1px solid #eee;
				border-radius: 8px;

				@media (width <= 768px) {
					grid-template-columns: 100px 1fr;
					grid-template-areas:
						'image details'
						'image price'
						'image controls';
					gap: 1rem;
					padding: 1rem;
					position: relative;
				}

				@media (width <= 500px) {
					grid-template-columns: 80px 1fr;
					gap: 0.75rem;
					padding: 0.75rem;
				}

				& .item-image {
					@media (width <= 768px) {
						grid-area: image;
						height: 100%;
					}

					& img,
					& .placeholder-image {
						width: 100%;
						height: 100%;
						object-fit: cover;
						border-radius: 4px;
						background-color: #f0f0f0;

						@media (width <= 768px) {
							object-fit: contain;
						}
					}
				}

				& .item-details {
					display: flex;
					flex-direction: column;
					gap: 0.5rem;

					@media (width <= 768px) {
						grid-area: details;
					}

					& h3 {
						margin: 0;
						font-family: var(--font-bold);
						font-size: clamp(var(--sm), 1.5vw, var(--h5));
						font-weight: 400;
						letter-spacing: -1px;

						@media (width <= 768px) {
							letter-spacing: 0px;
						}
					}

					& .item-price,
					& .item-size {
						margin: 0;
						display: flex;
						align-items: center;
						gap: 0.5rem;

						& .label {
							color: var(--color-secondary);
							font-family: var(--font-regular);
							font-size: clamp(var(--sm), 2vw, var(--h6));
						}

						& .value {
							color: var(--color-info);
							font-weight: 200;
							font-size: clamp(var(--sm), 1.5vw, var(--h6));
						}
					}

					& .item-size {
						& .value {
							color: var(--color-accent);
							font-weight: 600;
							text-transform: uppercase;
							letter-spacing: 1px;
						}
					}

					& .quantity-controls {
						display: flex;
						align-items: center;
						gap: 0.75rem;
						margin-top: 0.5rem;
						flex-wrap: wrap;

						@media (width <= 768px) {
							grid-area: controls;
							flex-direction: column;
							align-items: flex-start;
							gap: 0.5rem;
							margin-top: 0;
						}

						& .remove-btn {
							font-family: var(--font-semibold);
							font-size: clamp(var(--sm), 2vw, var(--h5));
							color: var(--color-danger);
							background: none;
							border: 1px solid var(--color-danger);
							border-radius: var(--radius);
							cursor: pointer;
							padding: 0.25rem 0.5rem;
							margin: 0;
							transition: color 0.2s ease;
							width: auto;
							height: auto;
							letter-spacing: 1px;

							&:hover {
								color: hsl(0, 75%, 45%);
							}
						}
					}
				}

				& .item-total {
					display: flex;
					flex-direction: row;
					align-items: center;
					gap: 0.5rem;
					justify-content: flex-end;

					@media (width <= 768px) {
						grid-area: price;
						align-items: flex-start;
						justify-content: flex-start;
						padding-top: 0.5rem;
					}

					& .label {
						color: var(--color-secondary);
						font-family: var(--font-regular);
						font-size: clamp(var(--sm), 2vw, var(--h6));
					}

					& p {
						margin: 0;
						font-weight: 700;
						color: var(--color-success);
						font-size: clamp(var(--sm), 1.5vw, var(--h5));
					}
				}
			}

			& .cart-summary {
				margin-top: 2rem;
				padding: 1.5rem;
				border: 1px solid #eee;
				border-radius: 8px;

				& .subtotal {
					display: flex;
					justify-content: center;
					gap: 1rem;
					font-family: var(--font-semibold);
					font-size: clamp(var(--sm), 2vw, var(--h5));
					margin-bottom: 1.5rem;
				}

				& .checkout-form {
					display: flex;
					flex-direction: column;
					gap: 1rem;
					margin: 1.5rem 0;

					& .checkout-btn {
						background-color: var(--color-accent);
						color: var(--color-secondary);
						border: none;
						border-radius: 4px;
						padding: 1rem;
						font-family: var(--font-regular);
						font-size: clamp(var(--sm), 3vw, var(--h5));
						font-weight: 500;
						letter-spacing: 1px;
						cursor: pointer;

						&:disabled {
							background-color: #cccccc;
						}
					}
				}

				& .continue-shopping {
					color: var(--color-dark);
					margin-top: 1rem;
					text-align: center;
					font-family: var(--font-regular);
					font-size: clamp(var(--sm), 3vw, var(--h5));
					letter-spacing: 0px;
					font-weight: 600;

					&:hover {
						text-decoration: underline;
					}
				}
			}
		}
	}
</style>
