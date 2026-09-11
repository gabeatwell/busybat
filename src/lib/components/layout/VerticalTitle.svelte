<script lang="ts">
	interface Props {
		title: string;
		class?: string;
	}

	let { title, class: className = '' }: Props = $props();
</script>

<div class="title-container {className}">
	<h1>{title}</h1>
</div>

<style>
	.title-container {
		position: fixed;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		z-index: 4;

		@media (width <= 500px) {
			right: 2rem;
			bottom: 1rem;
		}

		& h1 {
			color: var(--color-accent);
			-webkit-text-stroke: 1px var(--color-secondary);
			font-family: var(--font-title);
			font-size: clamp(var(--h5), 4vw, var(--h1));
			text-align: center;
			text-wrap: nowrap;
			writing-mode: vertical-lr;
			margin-bottom: 3em;
			margin-right: 0;
			z-index: 3;
			letter-spacing: -1px;

			@media (width <= 768px) {
				margin-bottom: 12em;
				margin-right: 0;
			}
		}
	}
</style>
