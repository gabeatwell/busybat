<script lang="ts">
	let { size = '10em' } = $props();
</script>

<span class="loader" style="width: {size}; height: {size}"></span>

<style>
	.loader {
		border-radius: 50%;
		display: inline-block;
		border-top: 1em solid var(--color-accent);
		border-right: 1em solid transparent;
		box-sizing: border-box;
		animation: rotation 1s linear infinite;
		position: relative;
		margin: 2em auto;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
