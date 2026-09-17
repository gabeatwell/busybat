import { createClient } from '@sanity/client';
import { env } from '$env/dynamic/public';

const projectId = env.PUBLIC_SANITY_PROJECT_ID ?? '';
const dataset = env.PUBLIC_SANITY_DATASET ?? 'production';

export const client = createClient({
	projectId: projectId,
	dataset: dataset,
	apiVersion: '2025-01-01',
	useCdn: true // fast for public content
});
