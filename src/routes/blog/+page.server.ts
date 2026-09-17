import { client } from '$lib/sanity/client';
import { getPosts } from '$lib/data/storage';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [sanityPosts, legacyPosts] = await Promise.all([
		client.fetch(`
            *[_type == "blogPost"] | order(publishedAt desc) {
                "id": _id,
                title,
                slug,
                "createdAt": publishedAt,
                "image": mainImage.asset->url,
                "content": pt::text(body)
            }
        `),
		getPosts()
	]);

	return { posts: [...sanityPosts, ...legacyPosts] };
};
