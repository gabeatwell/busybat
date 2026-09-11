<script lang="ts">
	import logo from '$lib/assets/logo.webp';
	import smallfinal from '$lib/assets/small-final.webp';
	import Button from '$lib/components/layout/Button.svelte';
</script>

<div class="content">
	<picture>
		<source srcset={smallfinal} media="(max-width: 600px)" />

		<img src={logo} alt="busy little bat" />
	</picture>

	<div class="hero-content">
		<h1>Busy Little Bat Sewing</h1>

		<p>Handmade clothing and accessories for the spooky and the strange</p>

		<Button href="/products" title="View Products" />
	</div>
</div>

<style>
	.content {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		height: 100vh;
		background-color: hsl(0, 0%, 100%);
		transform: translateY(-6em);
		position: relative;

		overflow: hidden;
		position: relative;
		inset: 0;
		width: 100%;
		z-index: 1;

		& picture {
			opacity: 0.25;
		}

		& img {
			width: fit-content;
			height: auto;

			@media (width <= 1150px) {
				width: 100%;
				max-width: 800px;
				margin-inline: auto;
				display: grid;
				place-items: center;
				padding-top: 5em;
			}

			@media (width <= 980px) {
				max-width: 600px;
			}

			@media (width <= 768px) {
				width: 90%;
				max-width: 400px;
				padding-top: 3em;
			}
		}

		@media (width <= 500px) {
			transform: translateY(-2em);
		}

		& .hero-content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: 1rem;
			text-align: center;
			position: absolute;
			inset: 0;
			padding: 1rem;

			& h1 {
				font-family: var(--font-semibold);
				font-size: clamp(var(--h4), 5vw, var(--lg));
				font-weight: 900;
				letter-spacing: 4px;
				color: var(--color-dark);
				margin: 0;
				visibility: hidden;
			}

			& p {
				font-family: var(--font-semibold);
				font-size: clamp(var(--h6), 1.5vw, var(--h4));
				font-weight: 800;
				letter-spacing: 0px;
				color: var(--color-secondary);
				margin: 0.5em 0;
			}

			@media (width <= 1800px) {
				transform: translateY(5em);
			}

			@media (width <= 768px) {
				margin-bottom: 6em;
				transform: translateY(0);
			}
		}
	}
</style>
