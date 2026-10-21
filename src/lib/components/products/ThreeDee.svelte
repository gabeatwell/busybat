<script lang="ts">
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import type { Mesh, Texture } from 'three';

	type Props = {
		gltf: string;
		scrollLength?: number;
		class?: string;
	};

	let { gltf, scrollLength = 1, class: className = '' }: Props = $props();

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

				// Normalise to ~2.6 world units and centre on the origin.
				const scale = 2.6 / maxDim;
				model.position.sub(center);
				model.scale.setScalar(scale);

				const modelWidth = size.x * scale;
				const modelHeight = size.y * scale;

				let startY = 0;
				let endY = 0;
				let dirty = true;

				function layout() {
					const width = host.clientWidth || 1;
					const height = host.clientHeight || 1;

					renderer.setSize(width, height, false);
					camera.aspect = width / height;
					camera.updateProjectionMatrix();

					const tanFov = Math.tan((camera.fov * Math.PI) / 360);
					const distance =
						(Math.max(modelHeight / 2, modelWidth / 2 / camera.aspect) / tanFov) * 1.25;
					camera.position.set(0, 0, distance);
					camera.lookAt(0, 0, 0);

					// Park the model fully below the viewport, then bring it to centre.
					const halfViewHeight = tanFov * distance;
					startY = -(halfViewHeight + modelHeight / 2) * 1.05;
					endY = 0;

					dirty = true;
				}

				const resizeObserver = new ResizeObserver(() => layout());
				resizeObserver.observe(host);
				layout();

				let targetProgress = 1;
				let currentProgress = 1;
				let scrollTrigger: ScrollTrigger | undefined;

				if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
					targetProgress = 0;
					currentProgress = 0;

					scrollTrigger = ScrollTrigger.create({
						trigger: stage,
						start: 'top top',
						end: 'bottom bottom',
						onUpdate: (self) => (targetProgress = self.progress),
						onRefresh: (self) => (targetProgress = self.progress)
					});

					targetProgress = scrollTrigger.progress;
					currentProgress = targetProgress;
				}

				const render = () => {
					currentProgress = targetProgress;

					const y = startY + (endY - startY) * currentProgress;
					const rotation = -0.45 + 0.45 * currentProgress;

					if (
						Math.abs(pivot.position.y - y) > 0.0001 ||
						Math.abs(pivot.rotation.y - rotation) > 0.0005
					) {
						pivot.position.y = y;
						pivot.rotation.y = rotation;
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
		overflow: hidden;

		.host {
			position: absolute;
			inset: 0;
			opacity: 0;
			transition: opacity 600ms ease;
			pointer-events: none;

			&.ready {
				opacity: 1;
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
