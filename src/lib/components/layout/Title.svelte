<script lang="ts">
	let { title }: { title: string } = $props();
</script>

<a href="/" aria-label="Go to homepage - {title}">
	<h1>{title}</h1>
</a>

<style>
	a {
		text-decoration: none;
		height: auto;
		display: inline-block;

		&:focus {
			outline: 2px solid var(--color-accent);
			outline-offset: 2px;
			border-radius: 4px;
		}

		&:focus-visible {
			outline: 2px solid var(--color-accent);
			outline-offset: 2px;
			border-radius: 4px;
		}

		& h1 {
			color: var(--color-accent);
			-webkit-text-stroke: 1px var(--color-secondary);
			font-family: var(--font-title);
			font-size: clamp(var(--h5), 3vw, var(--lg));
			text-align: center;
			text-wrap: nowrap;
			margin: 0;
			letter-spacing: -1px;
		}
	}
</style>
