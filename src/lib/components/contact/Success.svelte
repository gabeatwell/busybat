<script lang="ts">
	import Title from '$lib/components/layout/Title.svelte';
	import VerticalTitle from '$lib/components/layout/VerticalTitle.svelte';
</script>

<section>
	<Title title="Success" />

	<VerticalTitle title="Success" />

	<p>
		<i>Your message has been sent successfully</i>.
	</p>

	<p>We will contact you as soon as possible.</p>
</section>

<style>
	section {
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 65vh;
		gap: 1rem;
		transform: translateY(-2em);

		& p {
			font-family: var(--font-semibold);
			font-size: clamp(var(--h6), 4vw, var(--h2));
			letter-spacing: -1px;
			text-align: center;
			margin: 0;
			padding: 0;

			& i {
				font-family: var(--font-regular);
				font-size: clamp(var(--sm), 2vw, var(--h5));
				font-weight: 700;
			}
		}

		@media (width <= 500px) {
			transform: translateY(-5em);
		}
	}
</style>
