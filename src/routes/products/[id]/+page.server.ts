import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { MODELS, type ModelKey } from '$lib/components/products/threejs-products/models';
import productList from '$lib/components/products/productList.json';
import type { Product } from '$lib/types';

const products = productList as Product[];

function isModelKey(id: string): id is ModelKey {
	return Object.hasOwn(MODELS, id);
}

export const load: PageServerLoad = ({ params }) => {
	if (!isModelKey(params.id)) {
		error(404, `Unknown model: ${params.id}`);
	}

	return {
		id: params.id,
		gltf: MODELS[params.id],
		product: products.find((product) => product.slug === params.id || product.id === params.id)
	};
};
