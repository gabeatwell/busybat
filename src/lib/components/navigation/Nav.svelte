<script lang="ts">
	import { goto } from '$app/navigation';
	import Title from '$lib/components/layout/Title.svelte';
	// import logo from '$lib/assets/logo.webp';
	import pinkLeo from '$lib/assets/pink-leo.webp';
	import NavLink from '$lib/components/navigation/NavLink.svelte';
	// import CartIcon from '$lib/components/products/CartIcon.svelte';

	let isOpen = $state(false);

	const toggleMenu = () => (isOpen = !isOpen);

	const handleLinkClick = (event: MouseEvent) => {
		if (isOpen) {
			isOpen = false;

			const href = (event.currentTarget as HTMLElement).getAttribute('href');

			setTimeout(() => {
				if (href) goto(href);
			}, 10);

			event.preventDefault();
		}
	};
</script>

<nav
	style="background-image: url({pinkLeo}); background-size: cover; background-position: center; background-attachment: fixed; background-repeat: repeat;"
>
	<div class="title">
		<Title title="Busy Little Bat Sewing" />
	</div>

	<button
		class="burger"
		class:open={isOpen}
		onclick={toggleMenu}
		aria-label="Toggle navigation menu"
		aria-expanded={isOpen}
		aria-controls="navigation-menu"
	>
		<span class="bar"></span>
		<span class="bar"></span>
		<span class="bar"></span>
	</button>

	<ul class:open={isOpen} id="navigation-menu" aria-label="Main navigation">
		<!-- <li class="mobile-cart">
			<CartIcon onclick={handleLinkClick} navOpen={isOpen} />
		</li> -->
		<li>
			<NavLink title="About" url="/about" onclick={handleLinkClick} />
		</li>
		<li>
			<NavLink title="Creations" url="/products" onclick={handleLinkClick} />
		</li>
		<li>
			<NavLink title="Visions" url="/gallery" onclick={handleLinkClick} />
		</li>
		<li>
			<NavLink title="Chronicles" url="/blog" onclick={handleLinkClick} />
		</li>
		<li>
			<NavLink title="Summon Me" url="/contact" onclick={handleLinkClick} />
		</li>
	</ul>

	<!-- <div class="cart-container desktop-cart">
		<CartIcon navOpen={isOpen} />
	</div> -->
</nav>

<style>
	:global(::view-transition-group(navigation)) {
		z-index: 7;
	}

	nav {
		position: relative;
		top: 0;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		padding: 1rem;
		background-color: hsl(0, 0%, 100%);
		margin: 0;
		border-radius: 0;
		width: 100%;
		height: 3em;
		box-shadow: 0 0 4px var(--color-gray);
		z-index: 7;
		margin-inline: auto;
		view-transition-name: navigation;
		scale: 1;

		.title {
			opacity: 0.9;

			&:hover {
				opacity: 1;
			}
		}

		.burger {
			display: none;
			background-color: transparent;
			border: none;
			cursor: pointer;
			z-index: 4;

			.bar {
				display: block;
				width: 2rem;
				height: 0.25rem;
				background-color: var(--color-secondary);
				margin: 0.45rem;
				border-radius: 10px;
				transition: all 0.3s linear;
			}

			&.open {
				.bar:nth-child(1) {
					transform: rotate(45deg) translate(0.25rem, 0.75rem);
					transition: transform 0.3s linear;
					background-color: var(--color-dark);
				}

				.bar:nth-child(2) {
					opacity: 0;
				}

				.bar:nth-child(3) {
					transform: rotate(-45deg) translate(0.25rem, -0.75rem);
					transition: transform 0.3s linear;
					background-color: var(--color-dark);
				}
			}
		}

		ul {
			display: flex;
			gap: clamp(0.5rem, 1.75vw, 2rem);
			flex-flow: row wrap;
			margin: 0;
			padding: 0;
			list-style: none;
		}

		/* .desktop-cart {
			display: flex;
			align-items: center;
			margin-right: 1rem;
			position: relative;
		} */

		@media (width <= 1150px) {
			padding: 1em;

			ul {
				margin: 0 0.75rem;
				transform: scale(0.9);
				transform-origin: center;
			}
		}

		@media (width <= 980px) {
			padding: 0.5rem;

			/* .desktop-cart {
				margin-right: 3em;
				transform: scale(0.85);
				transform-origin: center;
				position: relative;
				right: 0;
			} */

			ul {
				margin: 0 0.5rem;
				transform: scale(0.85);
			}
		}
		@media (768px <= width <= 865px) {
			height: 4.5em;
			padding: 0.75rem;
			margin: 0;
			width: 100%;

			ul {
				gap: 0.5rem;
				flex-wrap: nowrap;
				justify-content: center;
				padding: 0 0.5rem;
				transform: scale(0.9);
				transform-origin: center;
			}
		}

		@media (600px <= width <= 767px) {
			height: 4.5em;
			padding: 0.5rem;
			margin: 0;
			width: 100%;

			ul {
				gap: 0.25rem;
				flex-wrap: nowrap;
				justify-content: center;
				padding: 0 0.25rem;
				transform: scale(0.8);
				transform-origin: center;
			}

			/* .desktop-cart {
				transform: scale(0.75);
				margin-right: 0.5rem;
			} */
		}

		@media (width <= 600px) {
			height: auto;
			padding: 0.5rem;
			margin: 0;
			width: 100%;
			border-radius: 0;

			ul {
				gap: 0.25rem;
			}
		}

		@media (width <= 500px) {
			justify-content: space-between;
			border-radius: 0;
			padding: 0.05rem 1rem;
			margin: 0;
			width: 95%;
			height: 3.25em;

			/* .desktop-cart {
				display: none;
			} */

			.burger {
				order: 3;
				display: block;
				position: relative;
				z-index: 12;
				margin-right: 1.2rem;
			}

			ul {
				position: fixed;
				inset: 0;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				gap: 2rem;
				width: 100vw;
				height: 100vh;
				background-color: var(--color-primary);
				z-index: 11;
				overflow-y: auto;
				transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1) !important;
				margin: 0;
				padding: 0;
				transform: translateX(-100%);
				left: 0;
				right: 0;

				li {
					opacity: 0;
					transform: translateX(0);
					transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
					pointer-events: none;
					text-align: center;
					width: 100%;
					padding: 0;
					margin: 0;
				}

				&.open {
					transform: translateX(0);
					left: 0;
					right: 0;
					height: 100vh;

					li {
						opacity: 1;
						transform: translateX(0);
						pointer-events: all;
						transition-delay: calc(((sibling-index() - 1) * 400ms));

						/* &.mobile-cart {
							display: flex;
							justify-content: center;
							align-items: center;
							width: 100%;
							list-style: none;
							opacity: 1;
							transform: translateX(0);
							transition-delay: 0.3s;
							pointer-events: all;
							margin: 0;
							padding: 0.5rem 0;

							:global(.cart-icon-wrapper) {
								display: flex;
								justify-content: center;
								align-items: center;
								width: auto;
								height: auto;
							}

							:global(.cart-icon) {
								color: var(--color-secondary);
								display: flex;
								justify-content: center;
								align-items: center;
								margin: 0;
								padding: 0;
							}
						} */
					}
				}
			}
		}
	}

	/* .mobile-cart {
		display: none;

		@media (width <= 500px) {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			margin: 0;
			padding: 0;

			:global(.cart-icon) {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				text-decoration: none;
				color: var(--color-secondary);
				font-family: var(--font-bold);
				font-size: clamp(var(--h5), 1.5vw, var(--h4));
				font-weight: 900;
				letter-spacing: 1px;
				margin: 0;
				padding: 0;
				white-space: nowrap;
				text-align: center;
			}
		}
	} */

	/* .desktop-cart {
		display: block;

		@media (500px <= width <= 990px) {
			position: relative;
			right: 0;
			margin-right: 0.25rem;
			transform: scale(0.8);
		}
	} */
</style>
