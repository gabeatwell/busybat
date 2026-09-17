import { client } from '$lib/sanity/client';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const about = await client.fetch(`
    *[_type == "aboutPage"][0] {
      title,
      body
    }
  `);

	return {
		about
	};
};
