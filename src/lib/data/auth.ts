import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import type { User } from '$lib/types';

function requireEnv(name: string): string {
	const value = env[name];
	if (!value) throw new Error(`Missing required environment variable: ${name}`);
	return value.trim();
}

const secret = () => requireEnv('JWT_SECRET');
const adminUsername = () => requireEnv('ADMIN_USERNAME');
const adminPassword = () => requireEnv('ADMIN_PASSWORD');

export function verifyToken(token: string | undefined): jwt.JwtPayload | null {
	if (!token) return null;
	try {
		const decoded = jwt.verify(token, secret());
		return typeof decoded === 'string' ? null : decoded;
	} catch {
		return null;
	}
}

export async function authenticate(username: string, password: string): Promise<string | null> {
	if (username === adminUsername() && password === adminPassword()) {
		return jwt.sign({ username } satisfies User, secret(), { expiresIn: '1h' });
	}
	return null;
}
