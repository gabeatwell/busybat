<script lang="ts">
	import SEO from '$lib/data/SEO.svelte';
	import VerticalTitle from '$lib/components/layout/VerticalTitle.svelte';
	import { slide } from 'svelte/transition';
	import type { Post } from '$lib/types';

	let { data } = $props();
	const posts = $derived(data.posts satisfies Post[]);
	let expandedPosts = $state(new Set<string | number>());

	function handleExpandToggle(postId: string | number) {
		if (expandedPosts.has(postId)) {
			expandedPosts.delete(postId);
		} else {
			expandedPosts.add(postId);
		}
		expandedPosts = new Set(expandedPosts);
	}
</script>

<svelte:head>
	<title>Blog - Latest Posts</title>
	<meta name="description" content="Read our latest blog posts and updates" />
</svelte:head>

<SEO
	title="Blog &middot; Busy Little Bat Sewing"
	description="Latest news, updates, and insights from Busy Little Bat Sewing. Stay updated with our fashion collections, behind-the-scenes content, and sewing tips."
	keywords="busy little bat sewing blog, busy little bat sewing craft fair, busy little bat sewing craft tips"
/>

<VerticalTitle title="Blog" />

<main class="blog-container">
	<section class="admin" aria-label="Admin navigation">
		{#if data.user}
			<a href="/admin" aria-label="Go to admin dashboard">Admin Dashboard</a>
		{:else}
			<a href="/login" aria-label="Go to admin login">Admin Login</a>
		{/if}
	</section>

	<header class="blog-header">
		<h1>Behind the seams..</h1>

		<p>Stay up to date with our latest news and insights</p>
	</header>

	{#if posts.length === 0}
		<div class="no-posts">
			<p>No blog posts available yet. Check back soon!</p>
		</div>
	{:else}
		<div class="posts-grid" role="main" aria-label="Blog posts">
			{#each posts as post (post.id)}
				<article class="post-card" aria-labelledby="post-title-{post.id}">
					<button
						class="post-card-button"
						onclick={() => handleExpandToggle(post.id)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								handleExpandToggle(post.id);
							}
						}}
					>
						<header class="post-header">
							{#if post.image}
								<div class="post-thumbnail">
									<img src={post.image} alt="Thumbnail for {post.title}" />
								</div>
							{/if}

							<div class="post-header-content">
								<div class="post-title-section">
									<h2 id="post-title-{post.id}">{post.title}</h2>
								</div>

								<div class="post-meta">
									<time datetime={post.createdAt}>
										{new Date(post.createdAt).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}
									</time>
								</div>
							</div>
						</header>
					</button>
					{#if expandedPosts.has(post.id)}
						<div
							class="post-content"
							id="post-content-{post.id}"
							aria-labelledby="post-title-{post.id}"
							transition:slide={{ duration: 500 }}
						>
							{#if post.image}
								<div class="post-image">
									<img src={post.image} alt="Featured image for {post.title}" />
								</div>
							{/if}

							<div class="post-text">
								<p>{post.content}</p>
							</div>
						</div>
					{/if}
				</article>
			{/each}
		</div>
	{/if}
</main>

<style>
	.blog-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;

		@media (width <= 768px) {
			padding: 0.5rem;
		}

		& .admin {
			display: flex;
			flex-direction: column;
			gap: 1rem;

			& a {
				color: var(--color-secondary);
				font-size: clamp(var(--sm), 1.5vw, var(--h5));
				font-weight: 700;
				padding: 0.5rem 1rem;
				width: fit-content;
			}
		}

		& .blog-header {
			text-align: center;
			margin-bottom: 3rem;

			& h1 {
				font-size: clamp(var(--h6), 5vw, var(--xl));
				color: var(--color-accent);
				-webkit-text-stroke: 1px var(--color-secondary);
				margin-bottom: 1rem;
			}

			& p {
				font-size: clamp(var(--sm), 1vw, var(--h5));
				color: var(--color-secondary);
				max-width: 600px;
				margin: 0 auto;
				line-height: 1.6;
			}

			@media (width <= 768px) {
				& h1 {
					font-size: 2rem;
				}

				& p {
					font-size: 1rem;
				}
			}
		}

		& .no-posts {
			text-align: center;
			padding: 3rem;
			color: var(--color-secondary);
			font-size: clamp(var(--sm), 2vw, var(--h5));
			font-weight: 500;
		}

		& .posts-grid {
			display: grid;
			gap: 2rem;
			grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
			align-items: start;

			@media (width <= 768px) {
				grid-template-columns: 1fr;
				gap: 1rem;
			}
		}
		& .post-card {
			background: white;
			border-radius: 12px;
			box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
			overflow: hidden;
			height: fit-content;
			transition:
				transform 0.2s ease,
				box-shadow 0.2s ease;

			&:hover {
				transform: translateY(-2px);
				box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
			}

			& .post-card-button {
				width: 100%;
				background: none;
				border: none;
				padding: 0;
				cursor: pointer;
				text-align: left;
				display: block;

				&:focus {
					outline: 2px solid var(--color-accent);
					outline-offset: 2px;
				}
			}

			& .post-header {
				display: flex;
				gap: 1rem;
				padding: 1.5rem 1.5rem 1rem;

				& .post-thumbnail {
					flex-shrink: 0;

					& img {
						width: 80px;
						height: 80px;
						object-fit: cover;
						border-radius: 8px;
						border: 1px solid #ddd;
						box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
					}

					@media (width <= 768px) {
						& img {
							width: 60px;
							height: 60px;
						}
					}
				}

				& .post-header-content {
					flex: 1;
					min-width: 0;

					& .post-meta {
						margin-top: -1rem;
						font-style: italic;
						font-weight: 200;
						opacity: 0.75;
					}
				}

				@media (width <= 768px) {
					flex-direction: column;
					gap: 0.75rem;

					& .post-thumbnail {
						align-self: center;
					}
				}

				& h2 {
					margin: 0 0 0.75rem 0;
					font-size: 1.5rem;
					color: #333;
					line-height: 1.3;
				}

				& .post-title-section {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 0.75rem;
				}
				& .post-meta {
					color: #666;
					font-size: 0.9rem;
				}

				@media (width <= 768px) {
					padding: 1rem 1rem 0.75rem;

					& h2 {
						font-size: 1.25rem;
					}
				}
			}
			& .post-content {
				padding: 1.5rem;
				border-top: 2px solid #eee;
				overflow-y: auto;
				background-color: #fafafa;
				border-radius: 0 0 12px 12px;
				position: relative;

				& .post-image {
					margin-bottom: 1.5rem;
					text-align: center;

					& img {
						max-width: 100%;
						max-height: 250px;
						width: auto;
						height: auto;
						object-fit: cover;
						border-radius: 8px;
						box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
						border: 1px solid #ddd;
					}

					@media (width <= 768px) {
						& img {
							max-height: 200px;
						}
					}
				}

				& .post-text {
					& p {
						margin: 0;
						line-height: 1.7;
						color: #555;
						font-size: 1rem;
						white-space: pre-wrap;
						word-wrap: break-word;
					}
				}

				/* Custom scrollbar styling */
				&::-webkit-scrollbar {
					width: 8px;
				}

				&::-webkit-scrollbar-track {
					background: #f1f1f1;
					border-radius: 4px;
				}

				&::-webkit-scrollbar-thumb {
					background: #c1c1c1;
					border-radius: 4px;

					&:hover {
						background: #a8a8a8;
					}
				}

				@media (width <= 768px) {
					padding: 1rem;
					max-height: 350px;
				}
			}
		}
	}
</style>
