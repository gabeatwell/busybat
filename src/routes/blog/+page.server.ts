import { client } from '$lib/sanity/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const sanityPosts = await client.fetch(`
        *[_type == "blogPost"] | order(publishedAt desc) {
            "id": _id, title, slug,
            "createdAt": publishedAt,
            "image": mainImage.asset->url,
            "content": pt::text(body)
        }
    `);

	return { posts: sanityPosts };
};
