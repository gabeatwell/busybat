import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { User } from '$lib/types';

// Use environment variables in production, fallback to defaults for development
const SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Replace with env variable in production
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'BusiestBat702!';

// Initialize admin credentials - this will be called when needed
let adminPasswordHash: string | null = null;

async function getAdminPasswordHash(): Promise<string> {
	if (!adminPasswordHash) {
		adminPasswordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
	}
	return adminPasswordHash;
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
	const adminHash = await getAdminPasswordHash();

	if (username === ADMIN_USERNAME && (await bcrypt.compare(password, adminHash))) {
		return jwt.sign({ username } satisfies User, SECRET, { expiresIn: '1h' });
	}
	return null;
}
