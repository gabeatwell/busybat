import fs from 'fs/promises';
import path from 'path';
import type { Post, PostData, UpdatePostData } from '$lib/types';

const POSTS_FILE = path.resolve('src/lib/data/posts.json');

// Global state for posts storage
let postsCache: Post[] | null = null;
let isFileSystemWritable: boolean | null = null;

// Test if file system is writable (for production vs development detection)
async function testFileSystemWritable(): Promise<boolean> {
	if (isFileSystemWritable !== null) return isFileSystemWritable;

	try {
		const testFile = path.resolve('test-write.tmp');
		await fs.writeFile(testFile, 'test');
		await fs.unlink(testFile);
		isFileSystemWritable = true;
	} catch {
		isFileSystemWritable = false;
	}

	return isFileSystemWritable;
}

// Load initial posts data
async function loadInitialPosts(): Promise<Post[]> {
	if (postsCache !== null) return postsCache;

	try {
		// Try to read from posts.json file first
		const data = await fs.readFile(POSTS_FILE, 'utf-8');
		postsCache = JSON.parse(data) as Post[];
	} catch {
		// If file doesn't exist or can't be read, use default posts
		postsCache = [
			{
				id: 1,
				title: 'Welcome to Our Blog!',
				content:
					"We're excited to launch our new blog where we'll share updates, insights, and stories. Stay tuned for more exciting content coming your way!",
				createdAt: '2025-06-18T10:00:00.000Z'
			}
		];
	}

	return postsCache;
}

// Save posts to file if possible, otherwise keep in memory
async function savePosts(posts: Post[]): Promise<void> {
	postsCache = posts;

	const canWrite = await testFileSystemWritable();
	if (canWrite) {
		try {
			await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
		} catch (error) {
			console.warn(
				'Failed to write posts to file, using in-memory storage:',
				error instanceof Error ? error.message : error
			);
		}
	}
}

// Get all posts
export async function getPosts(): Promise<Post[]> {
	return await loadInitialPosts();
}

// Get a single post by ID
export async function getPostById(id: string | number): Promise<Post> {
	const posts = await getPosts();
	const post = posts.find((p) => p.id === Number(id));

	if (!post) throw new Error('Post not found');

	return post;
}

// Create a new post
export async function createPost(post: PostData): Promise<Post> {
	const posts = await getPosts();
	// Generate a proper ID based on the highest existing ID + 1
	const maxId = posts.length > 0 ? Math.max(...posts.map((p) => p.id || 0)) : 0;
	const newPost: Post = {
		id: maxId + 1,
		...post,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};
	const updatedPosts = [...posts, newPost];

	await savePosts(updatedPosts);

	return newPost;
}

// Update an existing post
export async function updatePost(id: string | number, postData: UpdatePostData): Promise<Post> {
	const posts = await getPosts();
	const index = posts.findIndex((p) => p.id === Number(id));

	if (index === -1) throw new Error('Post not found');

	const updatedPosts = [...posts];

	updatedPosts[index] = {
		...updatedPosts[index],
		...postData,
		updatedAt: new Date().toISOString()
	};

	await savePosts(updatedPosts);

	return updatedPosts[index];
}

// Delete a post
export async function deletePost(id: string | number): Promise<void> {
	const posts = await getPosts();
	const filteredPosts = posts.filter((p) => p.id !== Number(id));

	await savePosts(filteredPosts);
}
