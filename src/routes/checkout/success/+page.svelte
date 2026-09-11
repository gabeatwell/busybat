<script lang="ts">
	import SEO from '$lib/data/SEO.svelte';
	import { page } from '$app/stores';

	let sessionId = $state($page.url.searchParams.get('session_id') || '');
	let isVerified = $state(false);

	// Optional: Verify the payment with your backend
	$effect(() => {
		if (sessionId) {
			(async () => {
				try {
					const response = await fetch('/api/verify-payment', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ sessionId })
					});

					if (response.ok) {
						isVerified = true;
					}
				} catch (error) {
					console.error('Error verifying payment:', error);
				}
			})();
		}
	});
</script>

<SEO
	title="Order Successful &middot; Busy Little Bat Sewing"
	description="Thank you for your purchase! Your order has been successfully processed."
	keywords="order success, payment successful, alternative fashion purchase, busy little bat sewing order success"
/>

<section class="success-container">
	<h1>Thank You for Your Order!</h1>

	<div class="success-message">
		<p>Your payment was successful and your order has been placed.</p>
		<p>We've sent a confirmation email with your order details.</p>

		{#if sessionId}
			<p class="order-id">Order Reference: {sessionId.substring(0, 8)}...</p>
		{/if}
	</div>

	<a href="/products" class="continue-button">Continue Shopping</a>
</section>

<style>
	.success-container {
		max-width: 600px;
		margin: auto;
		text-align: center;
		padding: 2rem;

		@media (width <= 768px) {
			margin-top: -5em;
		}

		& h1 {
			font-size: clamp(var(--h4), 5vw, var(--lg));
			letter-spacing: -1px;
			color: var(--color-accent);
			-webkit-text-stroke: 1px var(--color-secondary);

			@media (width <= 768px) {
				letter-spacing: 0;
			}
		}

		& .success-message {
			margin: 2rem 0;
			padding: 1.5rem;
			background-color: var(--color-primary);
			border-radius: 8px;
			border-left: 4px solid var(--color-accent);
			text-align: left;

			& p {
				font-family: var(--font-regular);
				font-size: clamp(var(--sm), 1.5vw, var(--h5));
				color: var(--color-secondary);
			}

			& .order-id {
				font-family: monospace;
				background: #e8f5e9;
				padding: 0.5rem;
				border-radius: 4px;
				margin-top: 1rem;
			}
		}

		& .continue-button {
			display: inline-block;
			margin-top: 1rem;
			padding: 0.75rem 1.5rem;
			background-color: var(--color-accent);
			color: var(--color-white);
			text-decoration: none;
			border-radius: 4px;
			font-family: var(--font-semibold);
			font-size: clamp(var(--sm), 2vw, var(--h5));
			letter-spacing: 1px;

			&:hover {
				background-color: hsl(320, 75%, 56%);
			}
		}
	}
</style>
