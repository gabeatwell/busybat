<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import Lenis from 'lenis';
	import 'lenis/dist/lenis.css';
	import { setLenis, scrollTo } from '$lib/data/lenis.svelte.js';

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		// Respect reduced motion: leave native scrolling untouched.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const lenis = new Lenis({
			autoRaf: false, // we drive it from gsap.ticker
			lerp: 0.09,
			smoothWheel: true,
			anchors: true // makes hash links scroll through Lenis
		});

		setLenis(lenis);
		lenis.on('scroll', ScrollTrigger.update);

		// Single RAF loop: gsap.ticker time is seconds, lenis.raf wants ms.
		const raf = (time: number) => lenis.raf(time * 1000);
		gsap.ticker.add(raf);
		gsap.ticker.lagSmoothing(0);

		const onLoad = () => ScrollTrigger.refresh();
		window.addEventListener('load', onLoad);

		return () => {
			window.removeEventListener('load', onLoad);
			gsap.ticker.remove(raf);
			gsap.ticker.lagSmoothing(500, 33);

			setLenis(null);
			lenis.destroy();
		};
	});

	afterNavigate((navigation) => {
		// SvelteKit restores scroll on navigation; make Lenis adopt the new position.
		if (navigation.type !== 'popstate') {
			scrollTo(0, { immediate: true });
		}
		ScrollTrigger.refresh();
	});
</script>
