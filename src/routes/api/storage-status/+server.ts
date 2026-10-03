import CloudflareKV from 'remote-cloudflare-kv';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const hasKVEnvVars = Boolean(
		process.env.CF_ACCOUNT_ID && process.env.CF_NAMESPACE_ID && process.env.CF_API_TOKEN
	);
	let isDatabaseConnected = false;
	let statusMessage = '';

	if (!hasKVEnvVars) {
		isDatabaseConnected = false;
		statusMessage = 'In-memory storage (posts persist only during session)';
	} else {
		try {
			// Test if we can connect to Cloudflare KV
			const kv = new CloudflareKV({
				account_id: process.env.CF_ACCOUNT_ID!,
				namespace_id: process.env.CF_NAMESPACE_ID!,
				api_token: process.env.CF_API_TOKEN!
			});
			await kv.list({ prefix: 'blog_posts', limit: 1 });
			isDatabaseConnected = true;
			statusMessage = 'Database storage (Cloudflare KV - changes persist across devices)';
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
