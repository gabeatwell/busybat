/** A blog post */
export interface Post {
	id: number;
	title: string;
	content: string;
	/** Path to the post's image (Vercel Blob URL or local `/uploads/...` path) */
	image?: string;
	createdAt: string;
	updatedAt?: string;
}

/** Input for creating a post */
export interface PostData {
	title: string;
	content: string;
	image?: string;
}

/** Input for updating a post (all fields optional) */
export type UpdatePostData = Partial<PostData>;

/** An authenticated user (from JWT payload) */
export interface User {
	username: string;
}

/** A product from the product list */
export interface Product {
	id: string;
	name: string;
	imageUrl: string;
	description: string;
	category: string;
	inStock: boolean;
	productUrl: string;
	dropdown: string;
	price?: number;
}

/** An item in the shopping cart */
export interface CartItem {
	id: string;
	name: string;
	imageUrl: string;
	productUrl?: string;
	price?: number;
	quantity: number;
	size?: string;
}

/** A gallery photo entry */
export interface GalleryImage {
	id: string;
	src: string;
	alt: string;
	title: string;
}

/** Adds a product (or product + size) to the cart */
export type AddToCartFn = (product: CartItem) => void;

/** Toggles product enlargement on/off */
export type ToggleEnlargementFn = (e?: MouseEvent | KeyboardEvent | boolean) => void;

/** Browser feature detection used by product cards */
export interface BrowserDetection {
	readonly supportsViewTransitions: boolean;
	readonly isFirefox: boolean;
	detectBrowser(): void;
}

/** Per-product cart state (tracks selection + cart membership) */
export interface CartState {
	readonly cart: CartItem[];
	readonly isAddedToCart: boolean;
	readonly selectedSize: string;
	updateCartState(): void;
	setSelectedSize(size: string): void;
}

/** Add-to-cart handler for a single product card */
export interface AddToCartHandler {
	readonly isLoading: boolean;
	handleAddToCart(
		e: MouseEvent,
		addToCart: AddToCartFn,
		toggleEnlargement: (value: boolean) => void
	): Promise<void>;
}

/** <select> element listeners for products with size options */
export interface SelectHandlers {
	setupSelectListeners(): void;
	cleanupSelectListeners(): void;
}

/** Accessibility / DOM helpers for product cards */
export interface AccessibilityHelpers {
	createScreenReaderAnnouncement(text: string): void;
	scrollProductInfoToTop(): void;
	hideNavElements(): void;
	showNavElements(): void;
	hideOtherProducts(
		productId: string,
		context: string,
		isFirefox: boolean,
		supportsViewTransitions: boolean
	): void;
	showOtherProducts(
		productId: string,
		context: string,
		isFirefox: boolean,
		supportsViewTransitions: boolean
	): void;
}

/** Dropdown open/close state handlers */
export interface DropdownHandlers {
	handleDropdownState(
		isOpen: boolean,
		productId: string,
		isEnlarged: boolean,
		isFirefox: boolean,
		supportsViewTransitions: boolean
	): void;
}

/** State setters used by the dropdown toggle handler */
export interface DropdownToggleSetter {
	isDropdownOpen(value?: boolean): boolean;
	id(): string;
}

/** State setters used by the enlargement toggle handler */
export interface EnlargementToggleSetter {
	isEnlarged(value?: boolean): boolean;
	isDropdownOpen(value?: boolean): boolean;
}

/** Context data for the enlargement toggle handler */
export interface EnlargementContextData {
	id: string;
	context: string;
}
