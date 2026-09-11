import { json } from '@sveltejs/kit';
import { clearCache, reloadDefaultPosts } from '$lib/data/kv-storage';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
	try {
		await clearCache();
		const newDefaults = await reloadDefaultPosts();
		return json({
			success: true,
			message: 'Cache cleared and default posts reloaded',
			defaultPosts: newDefaults
		});
	} catch (error) {
		console.error('Error clearing cache:', error);
		return json({ error: 'Failed to clear cache' }, { status: 500 });
	}
};
