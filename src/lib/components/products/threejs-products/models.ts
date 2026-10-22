export const MODELS = {
	vintage: '/models/vintage_sewing_machine.glb',
	retro: '/models/vintage_sewing_machine-retro.glb',
	needle: '/models/needle_of_sewing_machine.glb'
} as const;

export type ModelKey = keyof typeof MODELS;
