<script lang="ts">
	let {
		inStock,
		isLoading,
		isAddedToCart,
		isEnlarged,
		onAddToCart,
		onToggleEnlargement
	}: {
		inStock: boolean;
		isLoading: boolean;
		isAddedToCart: boolean;
		isEnlarged: boolean;
		onAddToCart: (e: MouseEvent) => void;
		onToggleEnlargement: (e?: MouseEvent | KeyboardEvent) => void;
	} = $props();
</script>

{#if isEnlarged}
	<button
		class="add-to-cart-btn {isLoading ? 'loading' : ''} {isAddedToCart ? 'added' : ''}"
		onclick={onAddToCart}
		onkeydown={(e) => {
			e.stopPropagation();
			if (e.key === 'Escape' && isEnlarged) {
				onToggleEnlargement();
			}
		}}
		disabled={!inStock || isLoading || isAddedToCart}
		class:expanded={isEnlarged}
		aria-live="polite"
	>
		{#if isLoading}
			<span class="loading-text">Loading</span>
		{:else if isAddedToCart}
			Added to Cart ✓
		{:else}
			{inStock ? 'Add to Cart' : 'Out of Stock'}
		{/if}
	</button>
{/if}

<style>
	.add-to-cart-btn {
		width: 100%;
		min-height: 2.8rem;
		height: 2.8rem;
		padding: 0.7rem;
		background-color: var(--color-accent);
		color: var(--color-white);
		border: none;
		border-radius: var(--radius);
		cursor: pointer;
		font-size: clamp(var(--sm), 1.5vw, var(--h6));
		font-weight: bold;
		transition: background-color 0.3s;
		grid-row: 5;
		display: none;
		line-height: 1;
		letter-spacing: 2px;
		margin-top: auto;

		&.expanded {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&:hover:not([disabled]) {
			background-color: hsl(320, 75%, 56%);
		}

		&:disabled {
			background-color: var(--color-gray);
			cursor: not-allowed;

			&.added {
				background-color: var(--color-dark);
				opacity: 0.9;
			}
		}

		&.loading {
			background-color: hsl(320, 75%, 45%);
			position: relative;
			overflow: hidden;

			& .loading-text {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%;
				letter-spacing: 0.5px;
				position: relative;
			}

			& .loading-text::after {
				content: '';
				animation: loadingDots 1s steps(1, end) infinite;
				margin-left: 4px;
				min-width: 24px;
				text-align: left;
			}
			&.added {
				background-color: var(--color-dark);
				cursor: default;
			}
		}
	}

	@keyframes loadingDots {
		0%,
		100% {
			content: '';
		}
		15% {
			content: '.';
		}
		30% {
			content: '..';
		}
		45%,
		85% {
			content: '...';
		}
	}
</style>
