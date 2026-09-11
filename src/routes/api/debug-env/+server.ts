import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const envVars = {
		KV_URL: process.env.KV_URL ? 'SET' : 'MISSING',
		KV_REST_API_URL: process.env.KV_REST_API_URL ? 'SET' : 'MISSING',
		KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN ? 'SET' : 'MISSING',
		KV_REST_API_READ_ONLY_TOKEN: process.env.KV_REST_API_READ_ONLY_TOKEN ? 'SET' : 'MISSING',
		JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'MISSING',
		// Show the actual values for debugging (remove this in production!)
		KV_REST_API_URL_VALUE: process.env.KV_REST_API_URL,
		KV_REST_API_TOKEN_VALUE: process.env.KV_REST_API_TOKEN
	};

	return new Response(JSON.stringify(envVars, null, 2), {
		headers: { 'Content-Type': 'application/json' }
	});
};
