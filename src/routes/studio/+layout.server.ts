import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
	const { user } = await parent(); // from src/routes/+layout.server.ts

	if (!user) {
		throw redirect(302, '/login?next=/studio');
	}

	return { user };
};
