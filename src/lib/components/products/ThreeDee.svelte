<script lang="ts">
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import type { Mesh, Texture } from 'three';

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
		scale = 1
	}: Props = $props();

	let stage: HTMLDivElement;
	let host: HTMLDivElement;

	let status = $state<'loading' | 'ready' | 'error'>('loading');
	let progress = $state(0);
	let errorMessage = $state('');

	$effect(() => {
		gsap.registerPlugin(ScrollTrigger);

		let disposed = false;
		let cleanup = () => {};

		(async () => {
			try {
				const THREE = await import('three');
				const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
				if (disposed) return;

				const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 1.1;
				renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;';
				host.appendChild(renderer.domElement);

				const scene = new THREE.Scene();
				const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200);
				camera.position.set(0, 0, 8);

				scene.add(new THREE.HemisphereLight(0xffffff, 0x3a2a4a, 2));
				const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
				keyLight.position.set(3, 5, 4);
				scene.add(keyLight);
				const fillLight = new THREE.DirectionalLight(0x8b5cf6, 1.8);
				fillLight.position.set(-4, 1, -3);
				scene.add(fillLight);

				const pivot = new THREE.Group();
				scene.add(pivot);

				const loaded = await new GLTFLoader().loadAsync(gltf, (event) => {
					if (event.total) progress = Math.round((event.loaded / event.total) * 100);
				});
				if (disposed) {
					renderer.dispose();
					renderer.domElement.remove();
					return;
				}

				const model = loaded.scene;
				pivot.add(model);

				const box = new THREE.Box3().setFromObject(model);
				const size = box.getSize(new THREE.Vector3());
				const center = box.getCenter(new THREE.Vector3());
				const maxDim = Math.max(size.x, size.y, size.z) || 1;

				const baseScale = 2.6 / maxDim;
				model.position.sub(center);

				const modelRoot = new THREE.Group();
				modelRoot.add(model);
				modelRoot.scale.setScalar(baseScale * startScale);
				pivot.add(modelRoot);

				const frameScale = Math.max(startScale, scale);
				const modelWidth = size.x * baseScale * frameScale;
				const modelHeight = size.y * baseScale * frameScale;
				const modelDepth = size.z * baseScale * frameScale;
				const visualHeight = size.y * baseScale * startScale;

				let startY = 0;
				let endX = 0;
				let endY = 0;
				let dirty = true;

				function layout() {
					const width = host.clientWidth || 1;
					const height = host.clientHeight || 1;

					renderer.setSize(width, height, false);
					camera.aspect = width / height;
					camera.updateProjectionMatrix();

					const maxYaw = Math.max(Math.abs(endRotation), Math.abs(endRotation - spin));
					const footprint = modelWidth * Math.cos(maxYaw) + modelDepth * Math.sin(maxYaw);

					const tanFov = Math.tan((camera.fov * Math.PI) / 360);
					const distance =
						(Math.max(modelHeight / 2, footprint / 2 / camera.aspect) / tanFov) * fit;
					camera.position.set(0, 0, distance);
					camera.lookAt(0, 0, 0);

					const halfViewHeight = tanFov * distance;
					const halfViewWidth = halfViewHeight * camera.aspect;

					startY = (halfViewHeight + visualHeight / 2) * 1.05;
					startY = halfViewHeight + visualHeight * 0.3;
					endX = halfViewWidth * offsetX;
					endY = 0;

					dirty = true;
				}

				const resizeObserver = new ResizeObserver(() => layout());
				resizeObserver.observe(host);
				layout();

				let targetProgress = 1;
				let scrollTrigger: ScrollTrigger | undefined;

				if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
					targetProgress = 0;

					scrollTrigger = ScrollTrigger.create({
						trigger: stage,
						start: 'top top',
						end: 'bottom bottom',

						onUpdate: (self) => (targetProgress = self.progress),
						onRefresh: (self) => (targetProgress = self.progress)
					});

					targetProgress = scrollTrigger.progress;
				}

				const arriveAt = 0.7;
				let lastOpacity = -1;

				const render = () => {
					const p = Math.min(targetProgress / arriveAt, 1);

					const startRotation = endRotation - spin;
					const rotation = startRotation + (endRotation - startRotation) * p;

					const currentScale = startScale + (scale - startScale) * p;
					const targetScale = baseScale * currentScale;

					// fade in
					const opacity = Math.min(targetProgress / 0.15, 1);
					if (opacity !== lastOpacity) {
						host.style.opacity = String(opacity);
						lastOpacity = opacity;
					}

					if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
						host.style.opacity = '1';
					}

					const x = endX * p;
					const y = startY + (endY - startY) * p;

					if (
						Math.abs(pivot.position.y - y) > 0.0001 ||
						Math.abs(pivot.position.x - x) > 0.0001 ||
						Math.abs(pivot.rotation.y - rotation) > 0.0005 ||
						Math.abs(modelRoot.scale.x - targetScale) > 0.0001
					) {
						pivot.position.set(x, y, 0);
						pivot.rotation.y = rotation;
						modelRoot.scale.setScalar(targetScale);
						dirty = true;
					}

					if (dirty) {
						renderer.render(scene, camera);
						dirty = false;
					}
				};

				gsap.ticker.add(render);
				dirty = true;

				cleanup = () => {
					gsap.ticker.remove(render);
					scrollTrigger?.kill();
					resizeObserver.disconnect();

					model.traverse((object) => {
						const mesh = object as Mesh;
						if (!mesh.isMesh) return;

						mesh.geometry.dispose();
						const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

						for (const material of materials) {
							for (const value of Object.values(material)) {
								if (value && (value as Texture).isTexture) (value as Texture).dispose();
							}
							material.dispose();
						}
					});

					renderer.dispose();
					renderer.domElement.remove();
				};

				status = 'ready';
				ScrollTrigger.refresh();
			} catch (error) {
				if (disposed) return;
				status = 'error';
				errorMessage = error instanceof Error ? error.message : 'Failed to load the 3D model.';
			}
		})();

		return () => {
			disposed = true;
			cleanup();
		};
	});
</script>

<div class="stage {className}" bind:this={stage} style:--scroll-length={scrollLength}>
	<div class="viewport">
		<div class="host" bind:this={host} class:ready={status === 'ready'} aria-hidden="true"></div>

		{#if status === 'loading'}
			<p class="status" aria-live="polite">Loading model… {progress}%</p>
		{:else if status === 'error'}
			<p class="status error" role="alert">Could not load 3D model: {errorMessage}</p>
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

			/* &.ready {
				opacity: 1;
			} */
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
