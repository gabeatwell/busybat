<script lang="ts">
	import {
		getCartData,
		handleCheckout,
		removeFromCart,
		updateQuantity,
		getCartTotal,
		addToCart
	} from './CartStore.svelte';

	export { addToCart };

	// Get reactive cart data from the store
	const { cart, customerEmail, isProcessingPayment, setEmail } = getCartData();

	// Calculate cart total as derived value
	let cartTotal = $derived(getCartTotal());
</script>

<section class="cart-container">
	<h2>Your Cart</h2>

	{#if cart.length === 0}
		<p>Your cart is empty</p>
	{:else}
		<div class="cart-items">
			{#each cart as item (item.id)}
				<div class="cart-item">
					<div class="item-details">
						<h3>{item.name}</h3>
						<p>${(item.price ?? 0).toFixed(2)}</p>
					</div>
					<div class="quantity-controls">
						<button onclick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
						<span>{item.quantity}</span>
						<button onclick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
					</div>
					<button class="remove-btn" onclick={() => removeFromCart(item.id)}>Remove</button>
				</div>
			{/each}

			<div class="cart-total">
				<h3>Total: ${cartTotal.toFixed(2)}</h3>
			</div>

			<div class="checkout-form">
				<input
					type="email"
					placeholder="Your email"
					value={customerEmail}
					onchange={(e) => setEmail((e.target as HTMLInputElement).value)}
					required
				/>

				<button
					class="checkout-btn"
					onclick={handleCheckout}
					disabled={isProcessingPayment || cart.length === 0}
				>
					{isProcessingPayment ? 'Processing...' : 'Proceed to Checkout'}
				</button>
			</div>
		</div>
	{/if}
</section>

<style>
	.cart-container {
		max-width: 600px;
		margin-inline: auto;
		padding: 1.2rem;

		& .cart-items {
			display: flex;
			flex-direction: column;
			gap: 15px;

			& .cart-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0.7rem;
				border-bottom: 1px solid #eee;

				& .quantity-controls {
					display: flex;
					align-items: center;
					gap: 10px;
				}
			}
		}

		& .checkout-form {
			margin-top: 20px;
			display: flex;
			flex-direction: column;
			gap: 10px;

			& .checkout-btn {
				background-color: #4caf50;
				color: white;
				padding: 12px;
				border: none;
				border-radius: 4px;
				cursor: pointer;
				font-size: clamp(var(--sm), 2vw, var(--h6));

				&:disabled {
					background-color: #cccccc;
					cursor: not-allowed;
				}
			}
		}
	}
</style>
