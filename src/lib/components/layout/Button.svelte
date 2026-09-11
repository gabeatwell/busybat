<script lang="ts">
	import { browser } from '$app/environment';

	let {
		title,
		href,
		newTab = false
	}: {
		title: string;
		href: string;
		newTab?: boolean;
	} = $props();

	function handleClick() {
		if (browser) {
			if (newTab) {
				window.open(href, '_blank');
			} else {
				window.location.href = href;
			}
		}
	}
</script>

<a
	class="button"
	{href}
	target={newTab ? '_blank' : null}
	rel={newTab ? 'noopener noreferrer' : null}
>
	{title}
</a>

<style>
	.button {
		font-family: var(--font-title);
		font-size: clamp(var(--h5), 5vw, var(--h2));
		letter-spacing: 1px;
		padding: 0.5rem 1rem;
		background-color: var(--color-accent);
		color: var(--color-primary);
		border: none;
		border-radius: var(--radius);
		cursor: pointer;
		width: fit-content;
		text-decoration: none;
		display: inline-block;
		text-align: center;
		z-index: 3;
		position: relative;
		-webkit-tap-highlight-color: transparent;
		-webkit-text-stroke: 1px var(--color-secondary);
		touch-action: manipulation;

		&:hover {
			background: linear-gradient(
				70deg,
				var(--color-accent),
				var(--color-secondary),
				var(--color-accent)
			);
			background-size: 200% 100%;
			box-shadow: 0 0 5px var(--color-accent);
			animation: gradientFlow 3s ease infinite;
		}

		@media (width <= 500px) {
			font-size: clamp(var(--h5), 2vw, var(--h4));
			padding: 0.75rem 1.25rem; /* Larger touch target on mobile */
		}
	}

	@keyframes gradientFlow {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
