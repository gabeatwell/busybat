<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import SEO from '$lib/data/SEO.svelte';
	import VerticalTitle from '$lib/components/layout/VerticalTitle.svelte';
	import Product from '$lib/components/products/Product.svelte';
	import ProductFilter from '$lib/components/products/ProductFilter.svelte';
	import { addToCart } from '$lib/components/products/CartStore.svelte';
	import type { Product as ProductType } from '$lib/types';
	import type { PageData } from './$types';

	let { data }: { data: PageData & { products: ProductType[] } } = $props();
	const products = $derived(data.products satisfies ProductType[]);
	let selectedCategory = $state('All');
	let supportsViewTransitions = $state(false);
	let isFirefox = $state(false);
	const containFitCategories = $state(['Bags', 'Wall Art', 'Accessories']);

	onMount(() => {
		supportsViewTransitions = browser && 'startViewTransition' in document;
		isFirefox = browser && navigator.userAgent.toLowerCase().includes('firefox');
	});

	function onCategoryChange(category: string) {
		selectedCategory = category;
	}

	function shouldHideProduct(product: ProductType) {
		// If no category is set on the product, consider it uncategorized
		if (!product.category) return selectedCategory !== 'All';

		return selectedCategory !== 'All' && product.category !== selectedCategory;
	}

	function getImageFit(category: string) {
		return containFitCategories.includes(category) ? 'contain' : 'cover';
	}
</script>

<SEO
	title="Our Products &middot; Busy Little Bat Sewing"
	description="Explore the unique and handmade products from Busy Little Bat Sewing."
	keywords="busy little bat sewing products, busy little bat sewing creations"
/>

<ProductFilter {products} {onCategoryChange} />

<section class="products">
	{#each products as product}
		{#if !shouldHideProduct(product)}
			<Product
				id={product.id}
				name={product.name}
				price={product.price ?? 0}
				imageUrl={product.imageUrl}
				description={product.description}
				inStock={product.inStock}
				context="products-page"
				productUrl={product.productUrl}
				category={product.category}
				imageFit={getImageFit(product.category)}
				{addToCart}
				dropdownImage={product.dropdown}
				style={supportsViewTransitions && !isFirefox
					? `view-transition-name: product-${product.id};`
					: ''}
			/>
		{/if}
	{/each}
</section>

<VerticalTitle title="Products" />

<style>
	.products {
		display: flex;
		flex-wrap: wrap;
		gap: 1em;
		justify-content: center;
		max-width: 1200px;
		width: 100%;
		box-sizing: border-box;
		margin-inline: auto;
		margin-bottom: 2rem;
		padding: 0 1rem;
	}

	.products :global(.product-card) {
		flex: 1 1 350px;
		min-width: 350px;
	}

	@media (width <= 768px) {
		.products {
			padding: 0 0.5rem;
		}

		.products :global(.product-card) {
			flex: 1 1 min(350px, 100%);
			min-width: min(350px, 100%);
			max-width: none;
		}
	}

	@media (width <= 500px) {
		.products {
			max-width: 350px;
		}

		.products :global(.product-card) {
			flex: 1 1 100%;
			min-width: 100%;
			max-width: none;
		}
	}

	/* Global view transition styles for individual products */
	@supports (view-transition-name: none) {
		:global([style*='view-transition-name: product-']::view-transition-old(*)),
		:global([style*='view-transition-name: product-']::view-transition-new(*)) {
			animation-duration: 0.4s;
			animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		}
	}

	/* Fallback for browsers without view transition support */
	@supports not (view-transition-name: none) {
		:global([style*='view-transition-name: product-']) {
			animation: none !important;
			transition:
				transform 0.3s ease,
				opacity 0.3s ease !important;
		}
	}
</style>
