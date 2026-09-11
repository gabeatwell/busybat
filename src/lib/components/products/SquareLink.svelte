<script lang="ts">
	let { href = 'https://busybatsewing.com' }: { href?: string } = $props();
</script>

<a {href} target="_blank" rel="noopener noreferrer" class="square-link">
	<h3>Proceed to Checkout</h3>
</a>

<style>
	.square-link {
		display: block;
		padding: 0.5rem 0;
		height: auto;
		background-color: var(--color-accent);
		color: var(--color-secondary);
		text-align: center;
		border-radius: var(--radius);
		text-decoration: none;
		transition: background-color 0.3s;

		&:hover {
			opacity: 0.9;
		}

		& h3 {
			letter-spacing: 2px;
			font-family: var(--font-semibold);
			font-size: clamp(var(--h6), 1.25vw, var(--h4));
			color: var(--color-primary);
			margin: 0;
		}
	}
</style>
