import { json } from '@sveltejs/kit';
import { createPost } from '$lib/data/kv-storage';
import { verifyToken } from '$lib/data/auth';
import { put } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { dev } from '$app/environment';
import fs from 'fs/promises';
import path from 'path';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!verifyToken(cookies.get('token'))) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const title = formData.get('title') as string | null;
		const content = formData.get('content') as string | null;
		const imageFile = formData.get('image') as File | null;

		if (!title || !content) {
			return json({ error: 'Title and content are required' }, { status: 400 });
		}

		let imagePath: string | null = null; // Handle image upload if present
		if (imageFile && imageFile.size > 0) {
			// Validate file type
			if (!imageFile.type.startsWith('image/')) {
				return json({ error: 'Only image files are allowed' }, { status: 400 });
			}

			// Validate file size (e.g., max 5MB)
			if (imageFile.size > 5 * 1024 * 1024) {
				return json({ error: 'Image file too large (max 5MB)' }, { status: 400 });
			}

			try {
				// Get file extension from the original filename
				const fileExtension = imageFile.name.split('.').pop() || 'jpg';
				const fileName = `blog-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

				// Use Vercel Blob in production or local storage in development
				if (BLOB_READ_WRITE_TOKEN && !dev) {
					// Production: Use Vercel Blob
					const blob = await put(fileName, imageFile, {
						access: 'public',
						token: BLOB_READ_WRITE_TOKEN
					});
					imagePath = blob.url;
				} else {
					// Development: Use local file system
					const uploadDir = path.join(process.cwd(), 'static', 'uploads');
					const filePath = path.join(uploadDir, fileName);

					// Ensure upload directory exists
					try {
						await fs.mkdir(uploadDir, { recursive: true });
					} catch {
						console.warn('Upload directory already exists or could not be created');
					}

					// Save file locally
					const arrayBuffer = await imageFile.arrayBuffer();
					const buffer = new Uint8Array(arrayBuffer);
					await fs.writeFile(filePath, buffer);
					imagePath = `/uploads/${fileName}`;
				}
			} catch (error) {
				console.error('Failed to save image:', error);
				return json({ error: 'Failed to save image' }, { status: 500 });
			}
		}

		const postData: { title: string; content: string; image?: string } = { title, content };
		if (imagePath) {
			postData.image = imagePath;
		}

		const newPost = await createPost(postData);

		return json({ success: true, post: newPost });
	} catch (error) {
		console.error('Error creating post:', error);

		return json({ error: 'Failed to create post' }, { status: 500 });
	}
};
