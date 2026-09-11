import { json } from '@sveltejs/kit';
import { updatePost, getPostById } from '$lib/data/kv-storage';
import { verifyToken } from '$lib/data/auth';
import { put, del } from '@vercel/blob';
import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { dev } from '$app/environment';
import fs from 'fs/promises';
import path from 'path';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies, params }) => {
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

		const postData: { title: string; content: string; image?: string } = { title, content };
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

					// Clean up old image file from blob storage
					try {
						const existingPost = await getPostById(params.id);
						if (existingPost && existingPost.image && existingPost.image !== imagePath) {
							// Only delete if it's a blob URL
							if (
								existingPost.image.includes('vercel-blob') ||
								existingPost.image.includes('blob.vercel-storage')
							) {
								await del(existingPost.image, { token: BLOB_READ_WRITE_TOKEN });
							}
						}
					} catch (error) {
						console.warn('Could not clean up old image:', error);
					}
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

					// Clean up old local image file
					try {
						const existingPost = await getPostById(params.id);
						if (existingPost && existingPost.image && existingPost.image !== imagePath) {
							// Only delete if it's a local file path
							if (existingPost.image.startsWith('/uploads/')) {
								const oldImagePath = path.join(process.cwd(), 'static', existingPost.image);
								await fs.unlink(oldImagePath);
							}
						}
					} catch (error) {
						console.warn('Could not clean up old image:', error);
					}
				}

				postData.image = imagePath;
			} catch (error) {
				console.error('Failed to save image:', error);
				return json({ error: 'Failed to save image' }, { status: 500 });
			}
		}

		await updatePost(params.id, postData);

		return json({ success: true });
	} catch (error) {
		console.error('Error updating post:', error);

		return json({ error: 'Failed to update post' }, { status: 500 });
	}
};
