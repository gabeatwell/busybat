<script>
	import PhotoGallery from '$lib/components/gallery/PhotoGallery.svelte';
	import SEO from '$lib/data/SEO.svelte';

	let { data } = $props();
</script>

<SEO
	title="Product Gallery &middot; Busy Little Bat Sewing"
	description="Explore our product gallery showcasing the unique and handmade clothing from Busy Little Bat Sewing. Discover our latest designs and inspirations."
	keywords="product gallery, photo gallery, handmade clothing, alternative fashion, busy little bat sewing gallery"
/>

<PhotoGallery images={data.images} />
