<script lang="ts">
	import { page } from '$app/state';
	import { MODELS, type ModelKey } from '$lib/components/products/models';
	import { error } from '@sveltejs/kit';
	import ThreeDee from '$lib/components/products/threejs-products/ThreeDee.svelte';

	const id = $derived(page.params.id as ModelKey);

	// if unknown model names
	$effect(() => {
		if (!(id in MODELS)) {
			error(404, `Unknown model: ${id}`);
		}
	});

	// per model tuning
	const config = $derived(
		{
			vintage: { endRotation: -0.35, offsetX: 0.16, scale: 1 },
			retro: { endRotation: 0.76, offsetX: -0.5, scale: 0.49 },
			needle: { endRotation: -0.35, offsetX: 0.16, scale: 1 }
		}[id] ?? { endRotation: -0.35, offsetX: 0.16, scale: 1 }
	);
</script>

{#if id in MODELS}
	<ThreeDee
		gltf={MODELS[id]}
		endRotation={config.endRotation}
		offsetX={config.offsetX}
		scale={config.scale}
	/>
{/if}
