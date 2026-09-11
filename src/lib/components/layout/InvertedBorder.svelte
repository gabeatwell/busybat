<script lang="ts">
	let { text, title, src, alt }: { text: string; title: string; src: string; alt: string } =
		$props();
</script>

<div class="inverted-border">
	<div class="content">
		<h2>{title}</h2>

		<p>{text}</p>
	</div>

	<img {src} {alt} />
</div>

<style>
	@property --angle {
		syntax: '<angle>';
		initial-value: 0deg;
		inherits: false;
	}

	.inverted-border {
		position: relative;
		width: 80vw;
		height: auto;
		padding: 1.5rem;
		margin-inline: auto;
		display: grid;
		grid-template-columns: 1fr auto 5rem;
		grid-template-areas: 'content img .';
		gap: 1rem;
		margin-block: 3em;
		place-items: center;

		@media (width <= 1150px) {
			margin-top: -10vw;
		}

		@media (width <= 1150px) {
			margin-top: -15vw;
		}

		@media (width <= 768px) {
			grid-template-columns: 1fr;
			grid-template-areas:
				'content'
				'img';
			padding: 1rem;
			margin-top: -45vw;
		}

		/* Container for content with background */
		&::before {
			content: '';
			position: absolute;
			inset: 7px;
			background-color: var(--color-secondary);
			mask: radial-gradient(20px at 40px 40px, transparent 98%, black) -40px -40px;
			-webkit-mask: radial-gradient(20px at 40px 40px, transparent 98%, black) -40px -40px;
			z-index: 1;
		}

		/* Animated border that follows scooped corners */
		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background: conic-gradient(
				from var(--angle),
				var(--color-accent),
				transparent 20%,
				var(--color-dark),
				var(--color-accent)
			);
			-webkit-mask: radial-gradient(20px at 40px 40px, transparent 98%, black) -40px -40px;
			mask: radial-gradient(20px at 40px 40px, transparent 98%, black) -40px -40px;
			z-index: 0;
			animation: spin 3.5s linear infinite;
		}

		& .content {
			grid-area: content;
			position: relative;
			z-index: 2;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
			width: 100%;
			gap: 1rem;
			align-self: center;
			margin-inline: auto;

			& h2 {
				color: var(--color-accent);
				-webkit-text-stroke: 1px var(--color-light);
				grid-area: title;
				text-align: center;
				margin: 0;
				padding: 0;
				font-family: var(--font-title);
				font-size: clamp(var(--h6), 7vw, var(--lg));
				letter-spacing: -1px;
				text-wrap: balance;
			}

			& p {
				color: var(--color-light);
				grid-area: text;
				padding: 0;
				font-family: var(--font-regular);
				font-size: clamp(var(--xs), 2vw, var(--h5));
				font-weight: 300;
				line-height: 1.1;
				margin-inline: auto;
				max-width: 65ch;
				letter-spacing: 0px;
			}
		}

		& img {
			grid-area: img;
			position: relative;
			z-index: 2;
			width: clamp(10em, 3vw, 15em);
			height: auto;
			object-fit: contain;
			align-self: center;
			justify-self: center;

			@media (width >= 768px) {
				width: clamp(10em, 3vw, 15em);
			}

			@media (width <= 768px) {
				margin: 0;
			}
		}
	}

	@keyframes spin {
		to {
			--angle: 360deg;
		}
	}
</style>
