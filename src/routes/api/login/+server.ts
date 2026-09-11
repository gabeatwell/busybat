import { json } from '@sveltejs/kit';
import { authenticate } from '$lib/data/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { username, password } = (await request.json()) as { username: string; password: string };
	const token = await authenticate(username, password);
	if (token) {
		return json({ token });
	}
	return json({ error: 'Invalid credentials' }, { status: 401 });
};
