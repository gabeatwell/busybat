<script lang="ts">
	import { MODELS } from '$lib/components/products/models';
	import ThreeDee from '$lib/components/products/ThreeDee.svelte';
</script>

<ThreeDee gltf={MODELS.retro} endRotation={0.76} offsetX={-0.5} scale={0.49} />
