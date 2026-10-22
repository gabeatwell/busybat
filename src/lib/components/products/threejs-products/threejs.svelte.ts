import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Mesh, Texture } from 'three';

gsap.registerPlugin(ScrollTrigger);

export type ThreeDeeOptions = {
	gltf: string;
	fit?: number;
	offsetX?: number;
	endRotation?: number;
	spin?: number;
	startScale?: number;
	scale?: number;
};

const defaults = {
	fit: 1.35,
	offsetX: 0.16,
	endRotation: -0.35,
	spin: 0.45,
	startScale: 1,
	scale: 1
};

export class ThreeDeeScene {
	status = $state<'loading' | 'ready' | 'error'>('loading');
	progress = $state(0);
	errorMessage = $state('');

	private readonly opts: Required<ThreeDeeOptions>;
	private disposed = false;
	private cleanup: (() => void) | null = null;

	constructor(options: ThreeDeeOptions) {
		this.opts = { ...defaults, ...options };
	}

	async init(stage: HTMLElement, host: HTMLElement) {
		if (this.disposed) return;

		try {
			const THREE = await import('three');
			const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
			if (this.disposed) return;

			const { gltf, fit, offsetX, endRotation, spin, startScale, scale } = this.opts;

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
				if (event.total) this.progress = Math.round((event.loaded / event.total) * 100);
			});
			if (this.disposed) {
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

			const layout = () => {
				const width = host.clientWidth || 1;
				const height = host.clientHeight || 1;

				renderer.setSize(width, height, false);
				camera.aspect = width / height;
				camera.updateProjectionMatrix();

				const maxYaw = Math.max(Math.abs(endRotation), Math.abs(endRotation - spin));
				const footprint = modelWidth * Math.cos(maxYaw) + modelDepth * Math.sin(maxYaw);

				const tanFov = Math.tan((camera.fov * Math.PI) / 360);
				const distance = (Math.max(modelHeight / 2, footprint / 2 / camera.aspect) / tanFov) * fit;
				camera.position.set(0, 0, distance);
				camera.lookAt(0, 0, 0);

				const halfViewHeight = tanFov * distance;
				const halfViewWidth = halfViewHeight * camera.aspect;

				startY = halfViewHeight + visualHeight * 0.3;
				endX = halfViewWidth * offsetX;
				endY = 0;

				dirty = true;
			};

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

			this.cleanup = () => {
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

			this.status = 'ready';
			ScrollTrigger.refresh();
		} catch (error) {
			if (this.disposed) return;
			this.status = 'error';
			this.errorMessage = error instanceof Error ? error.message : 'Failed to load the 3D model.';
		}
	}

	destroy() {
		this.disposed = true;
		this.cleanup?.();
		this.cleanup = null;
	}
}
