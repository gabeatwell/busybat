import { client } from '$lib/sanity/client';
import productsData from '$lib/components/products/productList.json';
import type { Product } from '$lib/types';

export async function load() {
	const products: Product[] = await client.fetch(`
        *[_type == "product"] | order(name asc) {
            "id": _id,
            name,
            description,
            category,
            inStock,
            price,
            "productUrl": "/products/" + slug.current,
            "imageUrl": images[0].asset->url,
            "dropdown": coalesce(images[1].asset->url, images[0].asset->url)
        }
    `);

	// Sanity has products? use them. Otherwise fall back to the old JSON.
	return { products: products.length ? products : productsData };
}
