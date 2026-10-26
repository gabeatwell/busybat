export const MODELS = {
	vintage: '/models/vintage_sewing_machine.glb',
	retro: '/models/vintage_sewing_machine-retro.glb',
	needle: '/models/needle_of_sewing_machine.glb',
	'debbie-harry': '/models/debby-harry2.glb',
	'major-menace': '/models/major-menace.glb',
	'mini-menace': '/models/mini-menace.glb',
	'dainty-pink': '/models/dainty-witches.glb'
} as const;

export type ModelKey = keyof typeof MODELS;
