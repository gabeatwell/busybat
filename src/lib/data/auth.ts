import jwt from 'jsonwebtoken';
import type { User } from '$lib/types';

// Auth secrets must be provided via environment variables (see .env / Vercel env).
const SECRET = process.env.JWT_SECRET ?? '';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '';

if (!SECRET || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
	throw new Error('Missing auth env vars: JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD');
}

export function verifyToken(token: string | undefined): jwt.JwtPayload | null {
	if (!token) return null;
	try {
		const decoded = jwt.verify(token, SECRET);
		return typeof decoded === 'string' ? null : decoded;
	} catch {
		return null;
	}
}

export async function authenticate(username: string, password: string): Promise<string | null> {
	if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
		return jwt.sign({ username } satisfies User, SECRET, { expiresIn: '1h' });
	}
	return null;
}
