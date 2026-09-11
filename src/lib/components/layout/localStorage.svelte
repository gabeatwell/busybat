<script lang="ts">
	import { browser } from '$app/environment';
	import { getCartData } from '$lib/components/products/CartStore.svelte';

	// Initialize state and effect for persistence
	let initialized = $state(false);

	// Load data from localStorage on component mount
	$effect(() => {
		if (!browser) return;

		// Load cart data
		const savedCart = localStorage.getItem('busybat_cart');
		if (savedCart) {
			try {
				const { cart, customerEmail } = JSON.parse(savedCart);
				const cartData = getCartData();
				// Update cart state
				cartData.cart = cart;
				cartData.customerEmail = customerEmail;
			} catch (e) {
				console.error('Error loading cart from localStorage:', e);
			}
		}

		initialized = true;
	});

	// Save cart data whenever it changes
	$effect(() => {
		if (!browser || !initialized) return;

		const { cart, customerEmail } = getCartData();
		localStorage.setItem('busybat_cart', JSON.stringify({ cart, customerEmail }));
	});
</script>
