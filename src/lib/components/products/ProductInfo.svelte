<script lang="ts">
	import { formatPrice } from './productFunctions.svelte';

	let {
		name,
		price,
		description,
		id,
		isEnlarged,
		context,
		supportsViewTransitions,
		isFirefox
	}: {
		name: string;
		price: number;
		description: string;
		id: string;
		isEnlarged: boolean;
		context: string;
		supportsViewTransitions: boolean;
		isFirefox: boolean;
	} = $props();
</script>

<div class="product-line" class:expanded={isEnlarged}>
	<h3
		class="product-name"
		class:expanded={isEnlarged}
		style={supportsViewTransitions && !isFirefox
			? `view-transition-name: ${context}-product-name-${id}`
			: ''}
	>
		{name}
	</h3>
	<p class="product-price" class:expanded={isEnlarged}>{formatPrice(price)}</p>
</div>

<p
	class="product-description"
	class:expanded={isEnlarged}
	id="product-description-{id}"
	aria-label="Product description: {description.replace(/<[^>]*>/g, '')}"
	role="region"
	aria-live={isEnlarged ? 'polite' : 'off'}
>
	{@html description}
</p>

<style>
	.product-line {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		grid-row: 1;
		margin-bottom: 0.5rem;

		@media (width <= 768px) {
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
			gap: 0.25rem;
		}

		&.expanded {
			grid-row: 1;
			margin: 0;
			padding-bottom: 0.25rem;
		}
	}

	.product-name {
		margin: 0;
		color: var(--color-dark);
		font-family: var(--font-bold);
		font-size: clamp(var(--h5), 2vw, var(--h4));
		font-weight: 600;
		letter-spacing: 1px;
		text-align: center;
		word-break: break-word;
		overflow-wrap: break-word;
		hyphens: auto;

		&.expanded {
			font-size: clamp(var(--h5), 2vw, var(--h3));
		}
	}

	.product-price {
		font-size: clamp(var(--h4), 1.75vw, var(--h2));
		font-weight: 700;
		color: var(--color-success);
		margin: 0.5rem 0;
		grid-row: 3;
		text-align: right;
		display: none;
		position: relative;

		&.expanded {
			display: block;
			display: none;

			@media (width <= 768px) {
				text-align: center;
				margin: 0;
			}
		}
	}

	.product-description {
		font-family: var(--font-regular);
		font-size: clamp(var(--sm), 1.25vw, var(--h6));
		font-weight: 500;
		letter-spacing: 0;
		line-height: 1.25;
		color: var(--color-secondary);
		margin-bottom: 1rem;
		display: -webkit-box;
		line-clamp: 3;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		grid-row: 3;
		transition: all 0.3s ease;
		display: none;
		margin-top: 0.5rem;

		&.expanded {
			line-clamp: initial;
			-webkit-line-clamp: initial;
			max-height: none;
			overflow: visible;
			padding-inline: 0.5rem;
			font-size: clamp(var(--sm), 1.5vw, var(--h5));
			display: block;
			padding-top: 0.25rem;
		}
	}
</style>
