<script lang="ts">
	let { title }: { title: string } = $props();
</script>

<button type="submit">{title}</button>

<style>
	button {
		font-family: var(--font-title);
		font-size: clamp(var(--h6), 5vw, var(--h1));
		letter-spacing: 1px;
		padding: 0.5rem 1rem;
		background-color: var(--color-accent);
		color: var(--color-primary);
		border: none;
		border-radius: var(--radius);
		cursor: pointer;
		width: 25%;
		margin-inline: auto;
		width: fit-content;
		display: grid;
		place-items: center;
		-webkit-text-stroke: 1px var(--color-secondary);

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
