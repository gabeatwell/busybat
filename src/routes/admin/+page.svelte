<script lang="ts">
	import SEO from '$lib/data/SEO.svelte';
	import { goto } from '$app/navigation';
	import VerticalTitle from '$lib/components/layout/VerticalTitle.svelte';
	import type { Post } from '$lib/types';

	let { data } = $props();
	let title = $state('');
	let content = $state('');
	let imageFile = $state<File | null>(null);
	let imagePreview = $state<string | null>(null);
	let editingPost = $state<Post | null>(null);
	let posts = $state<Post[]>([]);
	let loading = $state(false);
	let expandedPosts = $state(new Set<number>());

	// Load posts and storage status on component mount
	$effect(() => {
		loadPosts();
	});

	async function loadPosts() {
		loading = true;
		try {
			const res = await fetch('/api/posts');
			posts = await res.json();
		} catch (error) {
			console.error('Failed to load posts:', error);
		} finally {
			loading = false;
		}
	}

	async function logout() {
		try {
			await fetch('/api/logout', { method: 'POST' });
			goto('/login');
		} catch (error) {
			console.error('Logout failed:', error);
			// Force logout anyway
			document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
			goto('/login');
		}
	}

	async function createOrUpdatePost() {
		if (!title.trim() || !content.trim()) {
			// Use alert with better accessibility
			const message = 'Please fill in both title and content';
			alert(message);
			// Focus the first empty field
			if (!title.trim()) {
				document.getElementById('title')?.focus();
			} else if (!content.trim()) {
				document.getElementById('content')?.focus();
			}
			return;
		}

		loading = true;
		try {
			const endpoint = editingPost ? `/api/posts/edit/${editingPost.id}` : '/api/posts/create';

			// Create FormData for file upload
			const formData = new FormData();
			formData.append('title', title.trim());
			formData.append('content', content.trim());
			if (imageFile) {
				formData.append('image', imageFile);
			}

			const response = await fetch(endpoint, {
				method: 'POST',
				body: formData // Don't set Content-Type header, let browser set it for FormData
			});

			if (response.ok) {
				title = '';
				content = '';
				clearImage();
				editingPost = null;
				await loadPosts();
			} else {
				const error = await response.text();
				alert(`Failed to save post: ${error}`);
			}
		} catch (error) {
			console.error('Failed to save post:', error);
			alert('Failed to save post');
		} finally {
			loading = false;
		}
	}

	function editPost(post: Post) {
		editingPost = post;
		title = post.title;
		content = post.content;
		// Set image preview if post has an image
		if (post.image) {
			imagePreview = post.image;
			imageFile = null; // Clear any new file selection
		} else {
			clearImage();
		}
	}

	function cancelEdit() {
		editingPost = null;
		title = '';
		content = '';
		clearImage();
	}

	function handleImageChange(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			imageFile = file;
			// Create preview URL
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function clearImage() {
		imageFile = null;
		imagePreview = null;
		// Clear the file input
		const fileInput = document.getElementById('image') as HTMLInputElement | null;
		if (fileInput) fileInput.value = '';
	}

	function togglePostExpansion(postId: number) {
		if (expandedPosts.has(postId)) {
			expandedPosts.delete(postId);
		} else {
			expandedPosts.add(postId);
		}
		expandedPosts = new Set(expandedPosts);

		// Announce the change to screen readers
		const expanded = expandedPosts.has(postId);
		const button = document.querySelector<HTMLElement>(`[aria-controls="post-content-${postId}"]`);
		if (button) {
			button.setAttribute('aria-expanded', expanded.toString());
		}
	}

	async function deletePost(id: string | number) {
		// More accessible confirmation
		const confirmed = confirm('Are you sure you want to delete this post?');

		if (!confirmed) {
			return;
		}

		loading = true;
		try {
			const response = await fetch(`/api/posts/delete/${id}`, { method: 'POST' });

			if (response.ok) {
				await loadPosts();
			} else {
				alert('Failed to delete post');
			}
		} catch (error) {
			console.error('Failed to delete post:', error);

			alert('Failed to delete post');
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Dashboard &middot; Busy Little Bat Sewing</title>
	<meta name="description" content="Admin dashboard for managing blog posts and content." />
	<!-- Block search engine indexing -->
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<SEO
	title="Admin Dashboard &middot; Busy Little Bat Sewing"
	description="Admin dashboard for managing blog posts and content."
	keywords="admin, dashboard, blog management, content management"
/>

<VerticalTitle title="Admin Dashboard" />

<div class="admin-container">
	<header class="admin-header">
		<div class="header-content">
			<h1>Admin Dashboard</h1>
			<div class="header-actions">
				<span class="welcome">Welcome, {data.user.username}!</span>

				<button onclick={logout} class="logout-btn" aria-label="Logout from admin dashboard"
					>Logout</button
				>
			</div>
		</div>
	</header>

	<div class="post-form">
		<h2>{editingPost ? 'Edit Post' : 'Create New Post'}</h2>

		<form
			onsubmit={(e) => {
				e.preventDefault();
				createOrUpdatePost();
			}}
		>
			<div class="form-group">
				<label for="title">Title:</label>

				<input
					id="title"
					type="text"
					bind:value={title}
					placeholder="Enter post title..."
					disabled={loading}
					required
					aria-describedby="title-help"
				/>

				<small id="title-help" class="form-help">Enter a descriptive title for your blog post</small
				>
			</div>

			<div class="form-group">
				<label for="content">Content:</label>

				<textarea
					id="content"
					bind:value={content}
					placeholder="Write your post content here..."
					rows="10"
					disabled={loading}
					required
					aria-describedby="content-help"
				></textarea>

				<small id="content-help" class="form-help"
					>Write your blog post content. You can use line breaks and paragraphs.</small
				>
			</div>

			<div class="form-group">
				<label for="image">Image:</label>

				<input
					id="image"
					type="file"
					accept="image/*"
					onchange={handleImageChange}
					disabled={loading}
					aria-describedby="image-help"
				/>

				<small id="image-help" class="form-help"
					>Select an image file for your blog post (optional)</small
				>
				{#if imagePreview}
					<div class="image-preview">
						<img src={imagePreview} alt="Preview of selected file" />
						<button type="button" onclick={clearImage} class="remove-image-btn">Remove</button>
					</div>
				{/if}
			</div>

			<div class="form-actions">
				<button type="submit" disabled={loading || !title.trim() || !content.trim()}>
					{loading ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
				</button>

				{#if editingPost}
					<button type="button" onclick={cancelEdit} disabled={loading}> Cancel </button>
				{/if}
			</div>
		</form>
	</div>

	<div class="posts-section">
		<h2>Manage Posts ({posts.length})</h2>

		{#if loading && posts.length === 0}
			<p class="loading" aria-live="polite">Loading posts...</p>
		{:else if posts.length === 0}
			<p class="no-posts">No posts yet. Create your first post above!</p>
		{:else}
			<div class="posts-grid" role="region" aria-label="Blog posts management">
				{#each posts as post (post.id)}
					<article class="post-card" aria-labelledby="post-title-{post.id}">
						<div class="post-header">
							<div class="post-title-section">
								<h3 id="post-title-{post.id}">{post.title}</h3>

								<button
									class="expand-button"
									onclick={() => togglePostExpansion(post.id)}
									aria-label={expandedPosts.has(post.id) ? 'Collapse post' : 'Expand post'}
									aria-expanded={expandedPosts.has(post.id)}
									aria-controls="post-content-{post.id}"
								>
									<span class="expand-icon" class:expanded={expandedPosts.has(post.id)}>
										{expandedPosts.has(post.id) ? '▼' : '▶'}
									</span>
								</button>
							</div>
							<div class="post-meta">
								<small>Created: {new Date(post.createdAt).toLocaleDateString()}</small>
							</div>
						</div>

						{#if expandedPosts.has(post.id)}
							<div
								class="post-content"
								id="post-content-{post.id}"
								aria-labelledby="post-title-{post.id}"
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

						<div class="post-actions">
							<button
								onclick={() => editPost(post)}
								disabled={loading}
								class="edit-btn"
								aria-label="Edit {post.title}"
							>
								Edit
							</button>

							<button
								onclick={() => deletePost(post.id)}
								disabled={loading}
								class="delete-btn"
								aria-label="Delete {post.title}"
							>
								Delete
							</button>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.admin-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem 2rem;

		@media (width <= 768px) {
			padding: 0 0.75rem 0.75rem;
		}
		& .admin-header {
			background: var(--color-light);
			margin: 0 -2rem 2rem -2rem;
			padding: 1.5rem 2rem;
			border-bottom: 1px solid var(--color-fade-primary);

			& .header-content {
				display: flex;
				justify-content: space-between;
				align-items: center;
				max-width: 1200px;
				margin: 0 auto;

				& h1 {
					margin: 0;
					color: var(--color-accent);
					-webkit-text-stroke: 1px var(--color-secondary);
					font-size: clamp(var(--h5), 4vw, var(--lg));
				}

				& .header-actions {
					display: flex;
					align-items: center;
					gap: 1rem;

					& .welcome {
						color: var(--color-secondary);
						font-weight: 500;
						font-size: clamp(var(--sm), 1vw, var(--h6));
					}

					& .logout-btn {
						background: var(--color-danger);
						color: var(--color-white);
						border: none;
						padding: 0.5rem 1rem;
						border-radius: var(--radius);
						cursor: pointer;
						font-size: clamp(var(--xs), 1vw, var(--sm));
						font-weight: 600;
						letter-spacing: 1px;
						transition: background-color 0.2s;

						@media (width <= 768px) {
							letter-spacing: 0;
						}

						&:hover {
							background: var(--color-dark);
						}
					}
				}

				@media (width <= 768px) {
					flex-direction: column;
					gap: 1rem;
					align-items: flex-start;

					& .header-actions {
						align-self: stretch;
						justify-content: space-between;
					}
				}
			}

			@media (width <= 768px) {
				margin: 0 -1rem 2rem -1rem;
				padding: 1rem;
			}
		}
		& .post-form {
			background: var(--color-light);
			padding: 2rem;
			border: 1px solid var(--color-fade-primary);
			border-radius: var(--radius);
			margin-bottom: 3rem;

			& h2 {
				color: var(--color-secondary);
				font-size: clamp(var(--h6), 3vw, var(--h4));
				margin-bottom: 1.5rem;
			}

			& .form-group {
				margin-bottom: 1.5rem;

				& label {
					display: block;
					margin-bottom: 0.5rem;
					font-weight: 600;
					color: var(--color-secondary);
					font-size: clamp(var(--sm), 1vw, var(--h6));
				}

				& input[type='text'],
				& input[type='file'],
				& textarea {
					width: 100%;
					padding: 0.75rem;
					border: 1px solid var(--color-fade-primary);
					border-radius: var(--radius);
					font-size: clamp(var(--sm), 1vw, var(--h6));
					font-family: inherit;
					color: var(--color-secondary);
					box-sizing: border-box;

					&:focus {
						outline: none;
						border-color: var(--color-accent);
						box-shadow: 0 0 0 3px rgba(var(--color-accent), 0.2);
					}

					&:focus-visible {
						outline: 2px solid var(--color-accent);
						outline-offset: 2px;
					}
				}

				& input[type='file'] {
					padding: 0.5rem 0.75rem;
					cursor: pointer;

					&::file-selector-button {
						padding: 0.5rem 1rem;
						margin-right: 1rem;
						border: none;
						border-radius: var(--radius);
						background-color: var(--color-accent);
						color: var(--color-primary);
						cursor: pointer;
						font-size: clamp(var(--xs), 1vw, var(--sm));
						letter-spacing: 1px;

						@media (width <= 768px) {
							letter-spacing: 0px;
						}

						&:hover {
							background-color: var(--color-primary);
							color: var(--color-accent);
						}
					}
				}

				& .image-preview {
					margin-top: 1rem;
					padding: 1rem;
					border: 1px solid var(--color-fade-primary);
					border-radius: var(--radius);
					background-color: var(--color-white);

					& img {
						max-width: 200px;
						max-height: 200px;
						width: auto;
						height: auto;
						object-fit: cover;
						border-radius: var(--radius);
						display: block;
						margin-bottom: 0.75rem;
					}

					& .remove-image-btn {
						background-color: var(--color-danger);
						color: var(--color-white);
						border: none;
						padding: 0.5rem 1rem;
						border-radius: var(--radius);
						font-size: clamp(var(--xs), 1vw, var(--sm));
						cursor: pointer;

						&:hover {
							background-color: var(--color-dark);
						}

						&:focus {
							outline: none;
							box-shadow: 0 0 0 3px rgba(var(--color-danger), 0.3);
						}
					}
				}

				& .form-help {
					display: block;
					margin-top: 0.25rem;
					color: var(--color-gray);
					font-size: clamp(var(--xs), 1vw, var(--sm));
					line-height: 1.4;
				}

				& textarea {
					resize: vertical;
					min-height: 150px;
				}
			}
			& .form-actions {
				display: flex;
				gap: 1rem;

				& button {
					color: var(--color-primary);
					background-color: var(--color-accent);
					letter-spacing: 1px;

					@media (width <= 768px) {
						letter-spacing: 0;
					}

					&:hover {
						background-color: var(--color-primary);
						color: var(--color-accent);
						border: 1px solid var(--color-accent);
					}
				}
			}

			@media (width <= 768px) {
				padding: 0.5rem;
			}
		}
		& button {
			padding: 0.75rem 1.5rem;
			border: none;
			border-radius: var(--radius);
			font-size: clamp(var(--xs), 1vw, var(--h6));
			cursor: pointer;
			transition: background-color 0.2s;

			&:focus {
				outline: none;
				box-shadow: 0 0 0 3px rgba(var(--color-accent), 0.3);
			}

			&:focus-visible {
				outline: 2px solid var(--color-accent);
				outline-offset: 2px;
			}

			&[type='submit'] {
				background: var(--color-info);
				color: var(--color-white);

				&:hover:not(:disabled) {
					background: var(--color-primary);
					color: var(--color-accent);
				}
			}

			&[type='button'] {
				background: var(--color-gray);
				color: var(--color-white);

				&:hover:not(:disabled) {
					background: var(--color-dark);
				}
			}

			&:disabled {
				opacity: 0.6;
				cursor: not-allowed;
			}
		}
		& .posts-section {
			& h2 {
				margin-bottom: 1.5rem;
				color: var(--color-info);
				font-size: clamp(var(--h6), 3vw, var(--h4));
			}

			& .loading,
			& .no-posts {
				text-align: center;
				color: var(--color-warning);
				font-style: italic;
				padding: 2rem;
				font-size: clamp(var(--sm), 1vw, var(--h6));
			}
			& .posts-grid {
				display: grid;
				gap: 1.5rem;
				grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
				align-items: start;

				@media (width <= 768px) {
					grid-template-columns: 1fr;
				}
			}
			& .post-card {
				background: var(--color-white);
				border: 1px solid var(--color-fade-primary);
				border-radius: var(--radius);
				padding: 1rem;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				height: fit-content;

				@media (width <= 768px) {
					padding: 0.5rem;
				}

				& .post-header {
					& h3 {
						margin: 0 0 0.5rem 0;
						color: var(--color-secondary);
						font-size: clamp(var(--sm), 2vw, var(--h5));
						word-wrap: break-word;
						overflow-wrap: break-word;
						hyphens: auto;
						line-height: 1.4;
						flex: 1;
						min-width: 0;
					}

					& .post-title-section {
						display: flex;
						align-items: flex-start;
						justify-content: space-between;
						margin-bottom: 0.5rem;
						gap: 0.75rem;

						& .expand-button {
							background: none;
							border: none;
							cursor: pointer;
							padding: 0.25rem;
							border-radius: var(--radius);
							display: flex;
							align-items: center;
							justify-content: center;
							transition: background-color 0.2s ease;
							flex-shrink: 0;
							margin-top: 0.125rem;
							font-size: clamp(var(--h6), 2vw, var(--h4));

							&:hover {
								background-color: var(--color-primary);
							}

							&:focus {
								outline: none;
								background-color: var(--color-primary);
								box-shadow: 0 0 0 2px var(--color-accent);
							}

							&:focus-visible {
								outline: 2px solid var(--color-accent);
								outline-offset: 2px;
							}

							& .expand-icon {
								color: var(--color-secondary);
								transition: transform 0.2s ease;

								&.expanded {
									transform: rotate(0deg);
								}
							}
						}
					}

					& .post-meta {
						color: var(--color-gray);
						font-size: clamp(var(--xs), 1vw, var(--sm));
						margin-bottom: 1rem;
					}
				}
				& .post-content {
					margin-bottom: 1.5rem;
					border-top: 1px solid var(--color-fade-primary);
					padding: 1rem;
					animation: slideDown 0.3s ease-out;
					max-height: 300px;
					overflow-y: auto;
					background-color: var(--color-white);
					border-radius: 0 0 var(--radius) var(--radius);
					position: relative;

					& .post-image {
						margin-bottom: 1rem;

						& img {
							max-width: 100%;
							max-height: 150px;
							width: auto;
							height: auto;
							object-fit: cover;
							border-radius: var(--radius);
							border: 1px solid var(--color-fade-primary);
						}
					}

					/* Custom scrollbar styling */
					&::-webkit-scrollbar {
						width: 8px;
					}

					&::-webkit-scrollbar-track {
						background: var(--color-light);
						border-radius: 4px;
					}

					&::-webkit-scrollbar-thumb {
						background: var(--color-gray);
						border-radius: 4px;

						&:hover {
							background: var(--color-secondary);
						}
					}
					& .post-text {
						& p {
							margin: 0;
							line-height: 1.6;
							color: var(--color-secondary);
							font-size: clamp(var(--sm), 1vw, var(--h6));
							white-space: pre-wrap;
							word-wrap: break-word;
						}
					}

					@media (width <= 768px) {
						max-height: 200px;
						padding: 0.75rem;
					}
				}

				@keyframes slideDown {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				& .post-actions {
					display: flex;
					gap: 0.5rem;

					& .edit-btn {
						background: var(--color-success);
						color: var(--color-white);
						font-size: clamp(var(--xs), 1vw, var(--sm));
						font-weight: 600;
						letter-spacing: 1px;
						padding: 0.5rem 1rem;
						border-radius: var(--radius);

						@media (width <= 768px) {
							letter-spacing: 0;
						}

						&:hover:not(:disabled) {
							background: hsl(134, 61%, 31%);
						}
					}
					& .delete-btn {
						background: var(--color-danger);
						color: var(--color-white);
						font-size: clamp(var(--xs), 1vw, var(--sm));
						font-weight: 600;
						letter-spacing: 1px;
						padding: 0.5rem 1rem;
						border-radius: var(--radius);

						@media (width <= 768px) {
							letter-spacing: 0;
						}

						&:hover:not(:disabled) {
							background: hsl(354, 70%, 44%);
						}
					}
				}
			}
		}
	}
</style>
