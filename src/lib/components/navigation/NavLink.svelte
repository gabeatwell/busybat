<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		title: string;
		url: string;
		onclick?: (e: MouseEvent) => void;
	}

	let { title, url, onclick }: Props = $props();

	let isCurrentPage = $derived(page.url.pathname === url);
</script>

<a class="nav-link" href={url} {onclick} aria-current={isCurrentPage ? 'page' : undefined}
	>{title}</a
>

<style>
	.nav-link {
		overflow-y: clip;
		list-style: none;
		margin: 0;
		padding: 0;
		display: block;
		text-decoration: none;
		color: var(--color-secondary);
		font-family: var(--font-bold);
		font-size: clamp(var(--sm), 1.25vw, var(--h4));
		font-weight: 900;
		letter-spacing: 1px;
		margin-right: clamp(0.25rem, 1vw, 0.5rem);
		white-space: nowrap;
		text-align: center;
		transition: scale 0.2s ease;

		@media (600px <= width <= 768px) {
			font-size: clamp(var(--sm), 2.5vw, var(--h5));
		}

		@media (width <= 500px) {
			font-size: var(--h5);
		}

		&:is(:hover, :focus) {
			color: var(--color-accent);
			-webkit-text-stroke: 1px var(--color-secondary);
			scale: 1.05;
		}

		&:focus {
			outline: 2px solid var(--color-accent);
			border-radius: 4px;
		}
	}
</style>
