import { client } from '$lib/sanity/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const images = await client.fetch(`
        *[_type == "galleryImage"] | order(_createdAt desc) {
            "id": _id,
            "src": image.asset->url,
            alt,
            title
        }
    `);

	return { images };
};
