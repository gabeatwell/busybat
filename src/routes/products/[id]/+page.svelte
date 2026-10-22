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

	let atBottom = $state(false);
	// svelte-ignore non_reactive_update
	let panel: HTMLDivElement | undefined;

	function onscroll() {
		if (!panel) return;
		atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 8;
	}

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
	<div class="text-panel" bind:this={panel} {onscroll} class:at-bottom={atBottom}>
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
		overflow-y: auto;

		padding: 1.5rem 2rem;
		background: rgb(255 255 255 / 0.82);
		backdrop-filter: blur(6px);
		border: 3px solid var(--color-accent);
		border-radius: 0 var(--radius) var(--radius) 0;
		box-shadow: 0 8px 30px rgb(0 0 0 / 0.18);
		background-color: var(--color-primary);

		@media (width <= 900px) {
			top: auto;
			bottom: 0;
			left: 0;
			transform: none;
			width: 100%;
			max-height: 45svh;
			border-radius: var(--radius) var(--radius) 0 0;
		}

		@media (width <= 768px) {
			transform: translateY(-1em);
			width: 60%;
			max-height: 30svh;
			border: 1px solid var(--color-accent);
		}

		&::after {
			content: '';
			position: sticky;
			bottom: -2em;
			display: block;
			height: 3em;
			margin-top: -3em;
			pointer-events: none;

			background: linear-gradient(to top, rgb(255 255 255 / 0.82), transparent);
			display: none;

			@media (width <= 900px) {
				display: block;
			}
		}

		&.at-bottom::after {
			opacity: 0;
			transition: opacity 0.2s ease;
		}

		& h2 {
			font-family: var(--font-bold);
			font-size: clamp(var(--h5), 3vw, var(--h3));
			margin: 0 0 0.25rem;
			color: var(--color-secondary);
		}

		& h4 {
			font-family: var(--font-semibold);
			font-size: clamp(var(--sm), 1.3vw, var(--h4));
			color: var(--color-accent);
			margin: -0.8em 0 1rem 0;
		}

		& .description p {
			font-size: clamp(var(--sm), 1vw, var(--h5));
			line-height: 1.45;
			margin: 0 0 0.75rem;
		}

		& .dimensions {
			font-family: var(--font-semibold);
			font-size: clamp(var(--sm), 1vw, var(--h5));
		}

		& .gallery-link {
			color: var(--color-info);
			font-family: var(--font-semibold);
			font-size: clamp(var(--sm), 1.1vw, var(--h4));
		}
	}
</style>
