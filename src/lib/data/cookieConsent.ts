import { browser } from '$app/env';

export type ConsentChoice = 'accepted' | 'declined';

const STORAGE_KEY = 'cookie-consent';

export function getConsent(): ConsentChoice | null {
	if (!browser) return null;

	const value = localStorage.getItem(STORAGE_KEY);

	return value === 'accepted' || value === 'declined' ? value : null;
}

export function setConsent(choice: ConsentChoice): void {
	if (!browser) return;

	localStorage.setItem(STORAGE_KEY, choice);
}
