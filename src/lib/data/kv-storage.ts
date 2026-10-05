import CloudflareKV from 'remote-cloudflare-kv';
import fs from 'fs/promises';
import path from 'path';
import type { Post, PostData, UpdatePostData } from '$lib/types';

import { env } from '$env/dynamic/private';

const kv = new CloudflareKV({
	account_id: env.CF_ACCOUNT_ID || '',
	namespace_id: env.CF_NAMESPACE_ID || '',
	api_token: env.CF_API_TOKEN || ''
});

const isKVAvailable = (): boolean => {
	return Boolean(env.CF_ACCOUNT_ID && env.CF_NAMESPACE_ID && env.CF_API_TOKEN);
};

const POSTS_KEY = 'blog_posts';
const POSTS_INDEX_KEY = 'blog_posts_index';

let memoryPosts: Post[] | null = null;
let DEFAULT_POSTS: Post[] | null = null;

async function loadDefaultPosts(): Promise<Post[]> {
	try {
		const postsPath = path.resolve('src/lib/data/posts.json');
		const data = await fs.readFile(postsPath, 'utf-8');
		return JSON.parse(data) as Post[];
	} catch {
		return [
			{
				id: 1,
				title: 'Welcome to Our Blog!',
				content:
					"We're excited to launch our new blog where we'll share updates, insights, and stories. Stay tuned for more exciting content coming your way!",
				createdAt: '2025-06-18T10:00:00.000Z'
			}
		];
	}
}

export async function getPosts(): Promise<Post[]> {
	if (!DEFAULT_POSTS) DEFAULT_POSTS = await loadDefaultPosts();

	if (!isKVAvailable()) {
		if (!memoryPosts) memoryPosts = [...DEFAULT_POSTS];
		return memoryPosts.sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
	}

	try {
		const postIds = (await kv.get(POSTS_INDEX_KEY, { type: 'json' })) as number[] | null;
		if (!postIds || postIds.length === 0) {
			await initializeDefaultPosts();
			return DEFAULT_POSTS;
		}

		const posts: Post[] = [];
		for (const id of postIds) {
			const post = (await kv.get(`${POSTS_KEY}:${id}`, { type: 'json' })) as Post | null;
			if (post) posts.push(post);
		}

		return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	} catch (error) {
		console.error('Error getting posts from Cloudflare KV:', error);
		return DEFAULT_POSTS;
	}
}

export async function getPostById(id: string | number): Promise<Post> {
	if (!DEFAULT_POSTS) DEFAULT_POSTS = await loadDefaultPosts();

	if (!isKVAvailable()) {
		if (!memoryPosts) memoryPosts = [...DEFAULT_POSTS];
		const post = memoryPosts.find((p) => p.id === Number(id));
		if (!post) throw new Error('Post not found');
		return post;
	}

	const post = (await kv.get(`${POSTS_KEY}:${id}`, { type: 'json' })) as Post | null;
	if (!post) throw new Error('Post not found');
	return post;
}

export async function createPost(postData: PostData): Promise<Post> {
	if (!DEFAULT_POSTS) DEFAULT_POSTS = await loadDefaultPosts();

	if (!isKVAvailable()) {
		if (!memoryPosts) memoryPosts = [...DEFAULT_POSTS];
		const maxId = memoryPosts.length > 0 ? Math.max(...memoryPosts.map((p) => p.id)) : 0;
		const newPost: Post = {
			id: maxId + 1,
			...postData,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
		memoryPosts.push(newPost);
		return newPost;
	}

	const postIds = ((await kv.get(POSTS_INDEX_KEY, { type: 'json' })) as number[]) ?? [];
	const maxId = postIds.length > 0 ? Math.max(...postIds) : 0;
	const newId = maxId + 1;

	const newPost: Post = {
		id: newId,
		...postData,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	};

	await kv.put(`${POSTS_KEY}:${newId}`, JSON.stringify(newPost));
	await kv.put(POSTS_INDEX_KEY, JSON.stringify([...postIds, newId]));

	return newPost;
}

export async function updatePost(id: string | number, postData: UpdatePostData): Promise<Post> {
	if (!DEFAULT_POSTS) DEFAULT_POSTS = await loadDefaultPosts();

	if (!isKVAvailable()) {
		if (!memoryPosts) memoryPosts = [...DEFAULT_POSTS];
		const index = memoryPosts.findIndex((p) => p.id === Number(id));
		if (index === -1) throw new Error('Post not found');
		const updatedPost: Post = {
			...memoryPosts[index],
			...postData,
			updatedAt: new Date().toISOString()
		};
		memoryPosts[index] = updatedPost;
		return updatedPost;
	}

	const existing = (await kv.get(`${POSTS_KEY}:${id}`, { type: 'json' })) as Post | null;
	if (!existing) throw new Error('Post not found');

	const updatedPost: Post = {
		...existing,
		...postData,
		updatedAt: new Date().toISOString()
	};

	await kv.put(`${POSTS_KEY}:${id}`, JSON.stringify(updatedPost));
	return updatedPost;
}

export async function deletePost(id: string | number): Promise<void> {
	if (!DEFAULT_POSTS) DEFAULT_POSTS = await loadDefaultPosts();

	if (!isKVAvailable()) {
		if (!memoryPosts) memoryPosts = [...DEFAULT_POSTS];
		memoryPosts = memoryPosts.filter((p) => p.id !== Number(id));
		return;
	}

	await kv.delete(`${POSTS_KEY}:${id}`);
	const postIds = ((await kv.get(POSTS_INDEX_KEY, { type: 'json' })) as number[]) ?? [];
	const updatedIds = postIds.filter((postId) => postId !== Number(id));
	await kv.put(POSTS_INDEX_KEY, JSON.stringify(updatedIds));
}

async function initializeDefaultPosts(): Promise<void> {
	if (!DEFAULT_POSTS) DEFAULT_POSTS = await loadDefaultPosts();
	const postIds: number[] = [];
	for (const post of DEFAULT_POSTS) {
		await kv.put(`${POSTS_KEY}:${post.id}`, JSON.stringify(post));
		postIds.push(post.id);
	}
	await kv.put(POSTS_INDEX_KEY, JSON.stringify(postIds));
}

export async function reloadDefaultPosts(): Promise<Post[]> {
	DEFAULT_POSTS = null;
	memoryPosts = null;
	DEFAULT_POSTS = await loadDefaultPosts();
	return DEFAULT_POSTS;
}

export async function clearCache(): Promise<void> {
	DEFAULT_POSTS = null;
	memoryPosts = null;
}
