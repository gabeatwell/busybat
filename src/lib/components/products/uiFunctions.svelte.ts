import { browser } from '$app/environment';
import { getCartData } from './CartStore.svelte';
import type {
	BrowserDetection,
	CartState,
	AddToCartHandler,
	SelectHandlers,
	AccessibilityHelpers,
	DropdownHandlers,
	CartItem
} from '$lib/types';

export function createBrowserDetection(): BrowserDetection {
	const state = {
		supportsViewTransitions: false,
		isFirefox: false
	};

	function detectBrowser() {
		if (!browser) return;

		// Edge browser check for Android
		const ua = navigator.userAgent.toLowerCase();
		const isEdgeMobile = ua.includes('edg/') && ua.includes('android');
		if (isEdgeMobile) {
			state.supportsViewTransitions = false;
			return;
		}

		// Firefox detection
		state.supportsViewTransitions = browser && 'startViewTransition' in document;
		state.isFirefox = browser && navigator.userAgent.toLowerCase().includes('firefox');

		const urlParams = new URLSearchParams(window.location.search);
		const forceFirefoxMode = urlParams.get('firefox') === 'true';

		if (forceFirefoxMode) {
			state.isFirefox = true;
			state.supportsViewTransitions = false;
		}
	}

	return {
		get supportsViewTransitions() {
			return state.supportsViewTransitions;
		},
		get isFirefox() {
			return state.isFirefox;
		},
		detectBrowser
	};
}

// Cart state management
export function createCartState(productId: string): CartState {
	const state = {
		cart: [] as CartItem[],
		isAddedToCart: false,
		selectedSize: ''
	};

	function updateCartState() {
		if (!browser) return;

		const data = getCartData();
		state.cart = data.cart;
		state.isAddedToCart = state.cart.some((item) => {
			if (state.selectedSize) {
				return item.id === productId && item.size === state.selectedSize;
			}
			return item.id === productId && !item.size;
		});
	}

	function setSelectedSize(size: string) {
		state.selectedSize = size;
		updateCartState();
	}

	return {
		get cart() {
			return state.cart;
		},
		get isAddedToCart() {
			return state.isAddedToCart;
		},
		get selectedSize() {
			return state.selectedSize;
		},
		updateCartState,
		setSelectedSize
	};
}

// Add to cart functionality
export function createAddToCartHandler(
	productId: string,
	productData: CartItem,
	cartState: CartState
): AddToCartHandler {
	const state = {
		isLoading: false
	};

	async function handleAddToCart(
		e: MouseEvent,
		addToCart: (product: CartItem) => void,
		toggleEnlargement: (value: boolean) => void
	) {
		e.stopPropagation();

		// Check if this product has size options and no size is selected
		if (browser && productId === '3') {
			const productCard = document.querySelector(`.product-card.product-id-${productId}`);
			const selectElements = productCard?.querySelectorAll<HTMLSelectElement>('select');
			if (selectElements && selectElements.length > 0 && !cartState.selectedSize) {
				alert('Please select a size before adding to cart.');
				return;
			}
		}

		if (addToCart && !state.isLoading && !cartState.isAddedToCart) {
			state.isLoading = true;
			addToCart(productData);
			await new Promise((resolve) => setTimeout(resolve, 500));
			state.isLoading = false;
			cartState.updateCartState();
			toggleEnlargement(false);
		}
	}

	return {
		get isLoading() {
			return state.isLoading;
		},
		handleAddToCart
	};
}

// Select element handlers
export function createSelectHandlers(productId: string, cartState: CartState): SelectHandlers {
	function handleSelectClick(e: Event) {
		e.stopPropagation();
	}

	function handleSizeChange(e: Event) {
		cartState.setSelectedSize((e.target as HTMLSelectElement).value);
	}

	function setupSelectListeners() {
		if (!browser) return;

		const productCard = document.querySelector(`.product-card.product-id-${productId}`);
		if (!productCard) return;

		const selectElements = productCard.querySelectorAll<HTMLSelectElement>('select');
		selectElements.forEach((select) => {
			select.removeEventListener('click', handleSelectClick);
			select.removeEventListener('mousedown', handleSelectClick);
			select.removeEventListener('change', handleSizeChange);

			select.addEventListener('click', handleSelectClick);
			select.addEventListener('mousedown', handleSelectClick);
			select.addEventListener('change', handleSizeChange);

			if (select.value) {
				cartState.setSelectedSize(select.value);
			}
		});

		cartState.updateCartState();
	}

	function cleanupSelectListeners() {
		if (!browser) return;

		const productCard = document.querySelector(`.product-card.product-id-${productId}`);
		if (!productCard) return;

		const selectElements = productCard.querySelectorAll<HTMLSelectElement>('select');
		selectElements.forEach((select) => {
			select.removeEventListener('click', handleSelectClick);
			select.removeEventListener('mousedown', handleSelectClick);
			select.removeEventListener('change', handleSizeChange);
		});
	}

	return {
		setupSelectListeners,
		cleanupSelectListeners
	};
}

// Accessibility and UI utilities
export function createAccessibilityHelpers(): AccessibilityHelpers {
	function createScreenReaderAnnouncement(text: string) {
		const announcement = document.createElement('div');
		announcement.setAttribute('aria-live', 'polite');
		announcement.setAttribute('aria-atomic', 'true');
		announcement.className = 'visually-hidden';
		announcement.textContent = text;
		document.body.appendChild(announcement);

		setTimeout(() => {
			if (document.body.contains(announcement)) {
				document.body.removeChild(announcement);
			}
		}, 1000);
	}

	function scrollProductInfoToTop() {
		const productInfo = document.querySelector('.product-card.enlarged .product-info');
		if (productInfo) {
			productInfo.scrollTop = 0;
			productInfo.scrollTo(0, 0);
			productInfo.scrollTo({ top: 0, behavior: 'instant' });
		}
	}

	function hideNavElements() {
		const navElements = document.querySelectorAll<HTMLElement>('nav, header, .navbar');
		for (let i = 0; i < navElements.length; i++) {
			const el = navElements[i];
			if (window.innerWidth <= 768) {
				el.style.cssText += ';visibility:hidden';
			} else {
				el.style.cssText += ';z-index:1;opacity:0.25';
			}
		}
	}

	function showNavElements() {
		const navElements = document.querySelectorAll<HTMLElement>('nav, header, .navbar');
		navElements.forEach((el) => {
			el.style.removeProperty('z-index');
			el.style.removeProperty('opacity');
			el.style.removeProperty('visibility');
		});
	}

	function hideOtherProducts(
		productId: string,
		context: string,
		isFirefox: boolean,
		supportsViewTransitions: boolean
	) {
		const otherProducts =
			isFirefox || !supportsViewTransitions
				? document.querySelectorAll<HTMLElement>(`.product-card:not(.product-id-${productId})`)
				: document.querySelectorAll<HTMLElement>(
						`.product-card:not([style*="view-transition-name: ${context}-product-card-${productId}"])`
					);

		otherProducts.forEach((product) => {
			product.style.visibility = 'hidden';
			product.style.opacity = '0';
		});

		const footer = document.querySelector<HTMLElement>('footer');
		if (footer) {
			footer.style.visibility = 'hidden';
			footer.style.opacity = '0';
		}
	}

	function showOtherProducts(
		productId: string,
		context: string,
		isFirefox: boolean,
		supportsViewTransitions: boolean
	) {
		const otherProducts =
			isFirefox || !supportsViewTransitions
				? document.querySelectorAll<HTMLElement>(`.product-card:not(.product-id-${productId})`)
				: document.querySelectorAll<HTMLElement>(
						`.product-card:not([style*="view-transition-name: ${context}-product-card-${productId}"])`
					);
		const footer = document.querySelector<HTMLElement>('footer');

		otherProducts.forEach((product) => {
			product.style.removeProperty('visibility');
			product.style.opacity = '1';
			product.style.transition = 'opacity 0.3s ease';
		});
		if (footer) {
			footer.style.removeProperty('visibility');
			footer.style.opacity = '1';
			footer.style.zIndex = '20';
		}
	}

	return {
		createScreenReaderAnnouncement,
		scrollProductInfoToTop,
		hideNavElements,
		showNavElements,
		hideOtherProducts,
		showOtherProducts
	};
}

// Dropdown state management
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
