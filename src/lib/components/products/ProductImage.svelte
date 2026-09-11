<script lang="ts">
	let {
		imageUrl,
		name,
		inStock,
		context,
		id,
		imageFit = 'cover',
		category,
		supportsViewTransitions,
		isFirefox
	}: {
		imageUrl: string;
		name: string;
		inStock: boolean;
		context: string;
		id: string;
		imageFit?: string;
		category?: string;
		supportsViewTransitions: boolean;
		isFirefox: boolean;
	} = $props();

	const useContainFit = imageFit === 'contain' || category === 'Bags' || category === 'Clothing';
</script>

<div class="product-image">
	<img
		src={imageUrl}
		alt={name}
		class:zoomed-out={useContainFit}
		style={supportsViewTransitions && !isFirefox
			? `view-transition-name: ${context}-product-image-${id}`
			: ''}
	/>
	{#if !inStock}
		<div class="out-of-stock">Out of Stock</div>
	{/if}
</div>

<style>
	.product-image {
		position: relative;
		height: 300px;
		overflow: hidden;

		:global(.enlarged) & {
			height: min(70vh, 310px);
			transition: height 0.8s cubic-bezier(0.25, 1, 0.5, 1);
			padding-top: 1.2rem;
		}

		& img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		& .out-of-stock {
			position: absolute;
			inset: 0;
			background-color: hsla(0, 0%, 100%, 0.4);
			backdrop-filter: blur(2px);
			color: var(--color-black);
			font-size: clamp(var(--sm), 4vw, var(--h5));
			letter-spacing: clamp(1px, 2vw, 3px);
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: bold;
		}

		@media (max-width: 768px) {
			:global(.enlarged) & {
				height: 350px;
			}
		}

		@media (max-width: 480px) {
			:global(.enlarged) & {
				height: 200px;
			}
		}
	}

	.product-image img.zoomed-out {
		object-fit: contain;
	}
</style>
