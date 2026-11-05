<script lang="ts">
	import { onMount } from 'svelte';
	import { getConsent, setConsent } from '$lib/data/cookieConsent';

	let showBanner = $state(false);

	onMount(() => {
		// only show if use hasn't made a choice yet
		if (!getConsent()) {
			showBanner = true;
		}
	});

	function accept() {
		setConsent('accepted');
		showBanner = false;
	}
	function decline() {
		setConsent('declined');
		showBanner = false;
	}
</script>

{#if showBanner}
	<div class="cookie-banner" role="dialog" aria-label="cookie consent">
		<div class="content">
			<p>
				This site uses cookies (and local storage).

				<!-- <a href="/privacy" target="_blank" rel="nooopener">Learn More</a> -->
			</p>
		</div>

		<div class="actions">
			<button class="accept" onclick={accept}>Got It</button>
			<button class="decline" onclick={decline}>Decline</button>
		</div>
	</div>
{/if}

<style>
	.cookie-banner {
		position: fixed;
		bottom: 2em;
		left: 1em;
		right: 1em;
		max-inline-size: 500px;
		margin-inline: auto;
		background: var(--color-secondary);
		color: var(--color-primary);
		border-radius: var(--radius-4);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		z-index: 9999;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
		font-size: clamp(var(--sm), 1.4vw, var(--h3));
		padding: 0.5em 1.2em;
		border: 2px solid var(--color-accent);

		@media (width <= 768px) {
			flex-direction: row;
			align-items: center;
			gap: 1.5rem;
		}

		.content {
			& p {
				margin: 0;
				/*border-bottom: 2px solid var(--color-primary);*/
			}

			/*& a {
				color: var(--color-accent);
				text-decoration: underline;
				text-underline-offset: 2px;
			}*/
		}

		.actions {
			display: flex;
			gap: 2em;
			justify-content: flex-end;

			@media (width <= 768px) {
				flex-direction: column;
				flex-shrink: 0;
				gap: 0.5em;
			}

			& button {
				background: var(--color-secondary);
				color: var(--color-primary);
				border: none;
				padding: 0.5rem 1rem;
				border-radius: var(--radius-2);
				cursor: pointer;
				white-space: nowrap;

				&:active {
					transform: scale(0.97);
				}

				&.accept {
					background: transparent;
					color: var(--color-accent);
					border: 1px solid var(--color-accent);
					font-size: clamp(var(--sm), 1.3vw, var(--h4));

					&:hover {
						color: var(--color-primary);
						border-color: car(var(--color-primary));
					}
				}
				&.decline {
					background: transparent;
					color: var(--color-accent);
					border: 1px solid var(--color-accent);
					font-size: clamp(var(--sm), 1.3vw, var(--h4));

					&:hover {
						color: var(--color-primary);
						border-color: car(var(--color-primary));
					}
				}
			}
		}
	}
</style>
