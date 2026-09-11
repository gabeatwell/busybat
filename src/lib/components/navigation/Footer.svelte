<script lang="ts">
	import pinkLeo from '$lib/assets/pink-leo.webp';

	let { year = new Date().getFullYear(), name }: { year: number; name: string } = $props();
</script>

<footer>
	<section
		style="background-image: url({pinkLeo}); background-size: cover; background-position: center; background-attachment: fixed;"
	>
		<p>
			&copy;
			{year}

			{name} All rights reserved
		</p>
	</section>
</footer>

<style>
	footer {
		position: relative;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		background-color: transparent;
		margin: 0;
		padding: 0;
		line-height: 1;
		border-radius: var(--radius);
		z-index: 4;
		max-width: calc(100% - 2rem);
		width: fit-content;
		display: flex;
		justify-content: center;

		@media (width <= 500px) {
			width: 85%;
		}

		& section {
			border-radius: var(--radius);
			margin: 0;
			margin-bottom: var(--xs);
			padding: 0.25rem 0.5rem;
			width: 100%;
			display: flex;
			justify-content: center;

			@media (width <= 768px) {
				padding: 0.01rem;
			}

			& p {
				color: var(--color-secondary);
				font-family: var(--font-regular);
				font-size: clamp(var(--sm), 1.2vw, var(--h5));
				font-weight: 700;
				text-wrap: nowrap;
				display: inline-flex;
				justify-content: center;
				align-items: center;
				margin: 0;
				padding: 0.15em 0.5em;
				line-height: 1;
				text-align: center;

				@media (width <= 768px) {
					scale: 0.8;
					display: flex;
					justify-content: center;
					text-align: center;
				}
			}
		}
	}
</style>
