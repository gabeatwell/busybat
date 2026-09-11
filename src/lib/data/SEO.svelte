<script lang="ts">
	import { page } from '$app/state';
	import logo from '$lib/assets/logo.webp';

	interface Props {
		title: string;
		description: string;
		keywords: string;
	}

	let { title, description, keywords }: Props = $props();

	let siteName = 'Busy Bat Sewing Co.';
	let baseUrl = $derived(page.url.origin);
	let logoUrl = $derived(`${baseUrl}${logo}`);

	let canonicalUrl = $derived.by(() => {
		const { origin, pathname } = page.url;
		const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
		return `${origin}${normalizedPath}`;
	});
</script>

<svelte:head>
	<title>{title}</title>

	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />

	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:image" content={logoUrl} />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={logoUrl} />

	<script type="application/ld+json">
        {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": siteName,
            "description": description,
            "url": canonicalUrl,
            "logo": logoUrl,
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": canonicalUrl
            },
            "sameAs": [
                // Add social media URLs if available, e.g., "https://twitter.com/busybatsewing"
            ]
        })}
	</script>
</svelte:head>
