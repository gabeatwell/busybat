import { json } from '@sveltejs/kit';
import { deletePost } from '$lib/data/kv-storage';
import { verifyToken } from '$lib/data/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, params }) => {
	if (!verifyToken(cookies.get('token'))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	await deletePost(params.id);

	return json({ success: true });
};
