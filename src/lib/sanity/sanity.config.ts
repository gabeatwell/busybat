import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemas';
import { env } from '$env/dynamic/public';

const projectId = env.PUBLIC_SANITY_PROJECT_ID ?? 'missing-project-id';
const dataset = env.PUBLIC_SANITY_DATASET ?? 'production';

export default defineConfig({
	name: 'busybat',
	title: 'Busy Little Bat',
	projectId,
	dataset,
	plugins: [structureTool()],
	schema: { types: schemaTypes },
	basePath: '/studio' // admin will live at /studio
});
