<script lang="ts">
	import { ThreeDeeScene } from './threejs.svelte';

	type Props = {
		gltf: string;
		scrollLength?: number;
		fit?: number;
		class?: string;
		offsetX?: number;
		endRotation?: number;
		spin?: number;
		startScale?: number;
		scale?: number;
		orbit?: boolean;
	};

	let {
		gltf,
		scrollLength = 1,
		class: className = '',
		fit = 1.35,
		offsetX = 0.16,
		endRotation = -0.35,
		spin = 0.45,
		startScale = 1,
		scale = 1,
		orbit = true
	}: Props = $props();

	let stage: HTMLDivElement;
	let host: HTMLDivElement;

	let scene = $state.raw<ThreeDeeScene | null>(null);

	$effect(() => {
		const s = new ThreeDeeScene({
			gltf,
			fit,
			offsetX,
			endRotation,
			spin,
			startScale,
			scale,
			orbit
		});
		scene = s;
		s.init(stage, host);

		return () => {
			s.destroy();
			if (scene === s) scene = null;
		};
	});
</script>

<div class="stage {className}" bind:this={stage} style:--scroll-length={scrollLength}>
	<div class="viewport">
		<div
			class="host"
			bind:this={host}
			class:ready={scene?.status === 'ready'}
			aria-hidden="true"
		></div>

		{#if scene?.status === 'loading'}
			<p class="status" aria-live="polite">Loading model… {scene.progress}%</p>
		{:else if scene?.status === 'error'}
			<p class="status error" role="alert">Could not load 3D model: {scene.errorMessage}</p>
		{/if}
	</div>
</div>

<style>
	.stage {
		position: relative;
		isolation: isolate;

		/* One viewport for the sticky stage + N viewports of scroll travel. */
		height: calc(100vh + var(--scroll-length, 1) * 100vh);
		height: calc(100svh + var(--scroll-length, 1) * 100svh);
	}

	.viewport {
		position: sticky;
		top: 0;
		height: 100vh;
		height: 100svh;
		width: 100%;
		display: grid;
		place-items: center;
		/* overflow: hidden; */

		.host {
			position: absolute;
			inset: 0;
			opacity: 0;
			pointer-events: none;

			@media (hover: hover) and (pointer: fine) {
				pointer-events: auto;
				cursor: grab;

				&:active {
					cursor: grabbing;
				}
			}
		}

		.status {
			position: relative;
			z-index: 1;
			margin: 0;
			font-family: var(--font-regular);
			font-size: var(--h6, 1rem);
			color: var(--color-secondary);
			letter-spacing: 0.05em;
			pointer-events: none;

			&.error {
				color: var(--color-accent);
			}
		}
	}
</style>
