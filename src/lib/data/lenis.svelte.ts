import type Lenis from 'lenis';
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
	instance = lenis;
}
export function scrollTo(target: number | string | HTMLElement, options = {}) {
	if (instance) instance.scrollTo(target, options);
	else if (typeof target === 'number') window.scrollTo({ top: target });
}
