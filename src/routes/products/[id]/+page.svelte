<script lang="ts">
	import { page } from '$app/state';
	import { MODELS, type ModelKey } from '$lib/components/products/threejs-products/models';
	import { error } from '@sveltejs/kit';
	import type { Product } from '$lib/types';
	import productList from '$lib/components/products/productList.json';
	import ThreeDee from '$lib/components/products/threejs-products/ThreeDee.svelte';

	const id = $derived(page.params.id as ModelKey);
	const products = productList as Product[];
	const product = $derived(products.find((p) => p.slug === id || p.id === id));

	// if unknown model names
	$effect(() => {
		if (!(id in MODELS)) {
			error(404, `Unknown model: ${id}`);
		}
	});

	// per model tuning
	const config = $derived(
		{
			vintage: { endRotation: -0.41, offsetX: 0.36, scale: 0.7 },
			retro: { endRotation: -0.71, offsetX: 0.36, scale: 0.49 },
			needle: { endRotation: -2, offsetX: 0.36, scale: 1 },
			debbie: { endRotation: -1.85, offsetX: 0.36, scale: 1 },
			menace: { endRotation: -0.75, offsetX: 0.36, scale: 1 }
		}[id] ?? { endRotation: -1.85, offsetX: 0.36, scale: 1 }
	);
</script>

<div class="background-image" aria-hidden="true"></div>

{#if product}
	<div class="text-panel">
		<h2>{product.name}</h2>
		<h4>{product.category}</h4>
		<div class="description">
			{#each product.description.split('\n') as para}
				{#if para}<p>{para}</p>{/if}
			{/each}
			{#if product.dimensions}
				<p class="dimensions">{product.dimensions}</p>
			{/if}
			{#if product.galleryLink}
				<a
					href={product.galleryLink.href}
					target="_blank"
					rel="noopener noreferrer"
					class="gallery-link">{product.galleryLink.label}</a
				>
			{/if}
		</div>
	</div>
{/if}

{#if id in MODELS}
	<ThreeDee
		gltf={MODELS[id]}
		endRotation={config.endRotation}
		offsetX={config.offsetX}
		scale={config.scale}
	/>
{/if}

<style>
	.background-image {
		position: fixed;
		inset: 0;
		z-index: 0;
		background-image: url(/photos/small-final.webp);
		background-size: contain;
		background-position: center;
		background-repeat: no-repeat;
		opacity: 0.25;
		pointer-events: none;
	}

	.text-panel {
		position: fixed;
		top: 50%;
		left: 30%;
		transform: translateX(-50%);
		z-index: 10;

		width: min(40em, 75vw);
		max-height: 80svh;
		/* block-size: auto; */
		overflow-y: auto;

		padding: 1.5rem 2rem;
		background: rgb(255 255 255 / 0.82);
		backdrop-filter: blur(6px);
		border-radius: 0 var(--radius) var(--radius) 0;
		box-shadow: 0 8px 30px rgb(0 0 0 / 0.18);

		@media (width <= 900px) {
			top: auto;
			bottom: 0;
			left: 0;
			transform: none;
			width: 100%;
			max-height: 45svh;
			border-radius: var(--radius) var(--radius) 0 0;
		}

		& h2 {
			font-family: var(--font-bold);
			font-size: var(--h3);
			margin: 0 0 0.25rem;
			color: var(--color-secondary);
		}

		& h4 {
			font-family: var(--font-semibold);
			color: var(--color-accent);
			margin: 0 0 1rem;
		}

		& .description p {
			font-size: var(--sm);
			line-height: 1.45;
			margin: 0 0 0.75rem;
		}

		& .dimensions {
			font-family: var(--font-semibold);
		}

		& .gallery-link {
			color: var(--color-info);
			font-family: var(--font-semibold);
		}
	}
</style>
