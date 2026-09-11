<script lang="ts">
	let {
		id,
		name,
		isEnlarged,
		onClose,
		onStateChange,
		dropdownImage = null
	}: {
		id: string;
		name: string;
		isEnlarged: boolean;
		onClose?: () => void;
		onStateChange?: (isOpen: boolean) => void;
		dropdownImage?: string | null;
	} = $props();
	let isDropdownOpen = $state(false);

	const actualDropdownImage = dropdownImage;

	$effect(() => {
		onStateChange?.(isDropdownOpen);
		// Only control visibility when the product is enlarged
		if (isEnlarged) {
			const otherProducts = document.querySelectorAll<HTMLElement>(
				`.product-card:not([style*="view-transition-name: products-page-product-card-${id}"])`
			);
			if (isDropdownOpen) {
				otherProducts.forEach((product) => {
					product.style.opacity = '0';
					product.style.visibility = 'hidden';
				});
			}
		}
	});

	function toggleDropdown(e?: MouseEvent | KeyboardEvent) {
		e?.stopPropagation();
		isDropdownOpen = !isDropdownOpen;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
			e.preventDefault();
			e.stopPropagation();
			toggleDropdown(e);
		} else if (e.key === 'Escape') {
			e.preventDefault();
			if (isDropdownOpen) {
				isDropdownOpen = false;
			} else {
				onClose?.();
			}
		}
	}
</script>

<div class="dropdown-container">
	<div class="toggle-wrapper">
		<button
			class="dropdown-toggle"
			onclick={toggleDropdown}
			onkeydown={handleKeydown}
			aria-expanded={isDropdownOpen}
			aria-controls="product-dropdown-{id}"
			aria-label="View additional product details"
		>
			<span class="visually-hidden">View Details</span>
			<span class="arrow-icon">{isDropdownOpen ? '▲' : '▼'}</span>
		</button>
	</div>

	{#if isDropdownOpen}
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			class="dropdown-content"
			id="product-dropdown-{id}"
			role="region"
			aria-label="Additional product details"
			tabindex="0"
			onkeydown={(e) => {
				if (e.key === 'Escape') {
					e.preventDefault();
					isDropdownOpen = false;
				}
			}}
		>
			<img src={actualDropdownImage} alt={name} class="dropdown-image" />
		</div>
	{/if}
</div>

<style>
	.dropdown-container {
		width: 100%;
		margin: 0.25rem 0;
		grid-row: 2;
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;

		@media (max-width: 768px) {
			position: relative;
			z-index: 3;
		}

		& .toggle-wrapper {
			width: 100%;
			display: flex;
			justify-content: flex-end;
			padding-right: 1rem;
		}

		& .dropdown-toggle {
			width: 35px;
			height: 35px;
			padding: 0.5rem;
			background-color: var(--color-dark);
			color: white;
			border: none;
			border-radius: var(--radius);
			cursor: pointer;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: clamp(var(--sm), 1.25vw, var(--h6));
			font-weight: 500;
			transition: background-color 0.3s;
			z-index: 2;
			position: relative;
			aspect-ratio: 1 / 1;

			@media (max-width: 768px) {
				width: 30px;
				height: 30px;
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
			}

			&:focus-visible {
				outline: 3px solid var(--color-secondary);
				outline-offset: 2px;
				box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
			}

			&:hover {
				background-color: hsl(220, 10%, 25%);
			}
		}

		& .arrow-icon {
			font-size: 1.5em;
			transition: transform 0.3s;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		& .dropdown-content {
			position: relative;
			width: 100%;
			max-width: 600px;
			margin: 0 auto;
			border-radius: var(--radius);
			animation: slideDown 0.3s ease forwards;
			z-index: 2;
			box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
			background-color: white;
			overflow: hidden;

			& .dropdown-image {
				width: 100%;
				height: auto;
				display: block;
				border-radius: var(--radius);
				object-fit: contain;
			}
		}
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
