import { verifyToken } from '$lib/data/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ cookies }) => {
	const token = cookies.get('token');
	const user = token ? verifyToken(token) : null;
	return { user };
};
