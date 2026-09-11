import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const hasKVEnvVars = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;
	let isDatabaseConnected = false;
	let statusMessage = '';

	if (!hasKVEnvVars) {
		isDatabaseConnected = false;
		statusMessage = 'In-memory storage (posts persist only during session)';
	} else {
		try {
			// Test if we can connect to Vercel KV
			const { kv } = await import('@vercel/kv');
			await kv.ping();
			isDatabaseConnected = true;
			statusMessage = 'Database storage (Vercel KV - changes persist across devices)';
		} catch {
			isDatabaseConnected = false;
			statusMessage = 'Database connection failed (using in-memory storage)';
		}
	}

	return new Response(
		JSON.stringify({
			isDatabaseConnected,
			statusMessage,
			hasKVEnvVars
		}),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
};
