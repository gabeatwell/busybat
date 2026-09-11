import { browser } from '$app/environment';
import { createAccessibilityHelpers } from '$lib/components/products/uiFunctions.svelte';
import type {
	DropdownHandlers,
	DropdownToggleSetter,
	EnlargementContextData,
	EnlargementToggleSetter,
	ToggleEnlargementFn
} from '$lib/types';

// Format price with currency
export function formatPrice(value: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	}).format(value);
}

// Handle focus trapping for accessibility
export function trapFocus(element: HTMLElement): void {
	const focusableElements = element.querySelectorAll<HTMLElement>(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
	);

	if (focusableElements.length === 0) return;

	const firstElement = focusableElements[0];
	const lastElement = focusableElements[focusableElements.length - 1];

	// Set initial focus
	firstElement.focus();

	// Handle tab navigation
	element.addEventListener('keydown', (e) => {
		if (e.key === 'Tab') {
			if (e.shiftKey && document.activeElement === firstElement) {
				e.preventDefault();
				lastElement.focus();
			} else if (!e.shiftKey && document.activeElement === lastElement) {
				e.preventDefault();
				firstElement.focus();
			}
		}
	});
}

// Factory function for adding to cart
export function handleAddToCart(e: MouseEvent): void {
	e.stopPropagation();
}

// Factory function for dropdown toggle
export function createToggleDropdownHandler(
	setState: DropdownToggleSetter
): (event: Event) => void {
	return function toggleDropdown(event: Event): void {
		event.stopPropagation();
		event.preventDefault();

		setState.isDropdownOpen(!setState.isDropdownOpen());

		if (setState.isDropdownOpen()) {
			setTimeout(() => {
				const announcement = document.getElementById(`product-dropdown-${setState.id()}`);
				if (announcement) announcement.setAttribute('aria-live', 'polite');
			}, 100);
		}
	};
}

// Factory function for enlargement toggle
export function createToggleEnlargementHandler(
	contextData: EnlargementContextData,
	setState: EnlargementToggleSetter
): ToggleEnlargementFn {
	return function toggleEnlargement(e?: MouseEvent | KeyboardEvent | boolean): void {
		// Prevent enlargement toggle if the click came from a select element
		if (e && typeof e !== 'boolean') {
			const target = e.target as HTMLElement;
			if (target.tagName === 'SELECT' || target.closest('select')) {
				return;
			}
		}

		const { id, context } = contextData;
		const isFirefox = browser && navigator.userAgent.toLowerCase().includes('firefox');
		const supportsViewTransitions = browser && 'startViewTransition' in document;

		// Select other products differently for Firefox
		const otherProducts =
			isFirefox || !supportsViewTransitions
				? document.querySelectorAll<HTMLElement>(`.product-card:not(.product-id-${id})`)
				: document.querySelectorAll<HTMLElement>(
						`.product-card:not([style*="view-transition-name: ${context}-product-card-${id}"])`
					);
		const footer = document.querySelector<HTMLElement>('footer');

		if (supportsViewTransitions && !isFirefox) {
			document.documentElement.style.setProperty('--view-transition-duration', '0.15s');
			document.documentElement.style.setProperty('--view-transition-delay', '0.05s');

			const styleEl = document.createElement('style');
			styleEl.textContent = `
                @supports (view-transition-name: none) {
                    ::view-transition-old(${context}-product-card-${id}),
                    ::view-transition-new(${context}-product-card-${id}) {
                        animation-delay: 0.15s;
                        animation-timing-function: cubic-bezier(0.15, 0.1, 0.15, 1);
                        animation-duration: .5s;
                    }
                }
            `;
			document.head.appendChild(styleEl);

			const transition = document.startViewTransition(() => {
				setState.isEnlarged(!setState.isEnlarged());
				document.body.offsetHeight;

				// Add a small delay when enlarging to ensure proper positioning
				if (setState.isEnlarged()) {
					setTimeout(() => {
						const productInfo = document.querySelector<HTMLElement>(
							'.product-card.enlarged .product-info'
						);
						if (productInfo) {
							productInfo.scrollTo({ top: 0, behavior: 'instant' });
							productInfo.scrollTop = 0;
						}
					}, 80);
				}

				if (!setState.isEnlarged()) {
					setState.isDropdownOpen(false);
					if (!setState.isDropdownOpen()) {
						otherProducts.forEach((product) => {
							product.style.removeProperty('visibility');
							product.style.opacity = '0.3';
							product.style.transition = 'opacity 0.35s ease';
						});
						if (footer) {
							footer.style.removeProperty('visibility');
							footer.style.opacity = '0.3';
							footer.style.zIndex = '20';
							footer.style.transition = 'opacity 0.35s ease';
						}
					}
				} else {
					setTimeout(() => {
						otherProducts.forEach((product) => {
							product.style.opacity = '0';
							product.style.visibility = 'hidden';
						});
						if (footer) {
							footer.style.zIndex = '1';
							footer.style.opacity = '0';
							footer.style.visibility = 'hidden';
						}
					}, 150);
				}
			});

			transition.finished.then(() => {
				document.head.removeChild(styleEl);
				if (!setState.isEnlarged() && !setState.isDropdownOpen()) {
					otherProducts.forEach((product) => {
						product.style.opacity = '1';
					});
					if (footer) {
						footer.style.opacity = '1';
					}
				}
			});
		} else {
			// Fallback for Firefox and browsers without view transitions
			setState.isEnlarged(!setState.isEnlarged());

			if (setState.isEnlarged()) {
				// When enlarging, hide other products after a short delay
				setTimeout(() => {
					otherProducts.forEach((product) => {
						product.style.opacity = '0';
						product.style.visibility = 'hidden';
						product.style.transition = 'opacity 0.3s ease';
					});
					if (footer) {
						footer.style.opacity = '0';
						footer.style.visibility = 'hidden';
						footer.style.transition = 'opacity 0.3s ease';
					}
				}, 100);
			} else {
				// When un-enlarging, show other products immediately
				setState.isDropdownOpen(false);
				otherProducts.forEach((product) => {
					product.style.removeProperty('visibility');
					product.style.opacity = '1';
					product.style.transition = 'opacity 0.3s ease';
				});
				if (footer) {
					footer.style.removeProperty('visibility');
					footer.style.opacity = '1';
					footer.style.transition = 'opacity 0.3s ease';
				}
			}
		}
	};
}

// Dropdown state management (moved from uiFunctions.svelte.js)
export function createDropdownHandlers(): DropdownHandlers {
	function handleDropdownState(
		isOpen: boolean,
		productId: string,
		isEnlarged: boolean,
		isFirefox: boolean,
		supportsViewTransitions: boolean
	) {
		if (!isOpen && !isEnlarged) {
			const { showOtherProducts } = createAccessibilityHelpers();
			showOtherProducts(productId, 'default', isFirefox, supportsViewTransitions);
		}
	}

	return {
		handleDropdownState
	};
}

// Factory function for handleDropdownState
export function createHandleDropdownState(
	dropdownHandlers: DropdownHandlers,
	id: string,
	isEnlarged: boolean,
	isFirefox: boolean,
	supportsViewTransitions: boolean
): (isOpen: boolean) => void {
	return function handleDropdownState(isOpen: boolean): void {
		dropdownHandlers.handleDropdownState(
			isOpen,
			id,
			isEnlarged,
			isFirefox,
			supportsViewTransitions
		);
	};
}
