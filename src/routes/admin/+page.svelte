<script lang="ts">
	import SEO from '$lib/data/SEO.svelte';
	import { goto } from '$app/navigation';
	import VerticalTitle from '$lib/components/layout/VerticalTitle.svelte';

	let { data } = $props();

	async function logout() {
		try {
			await fetch('/api/logout', { method: 'POST' });
			goto('/login');
		} catch (error) {
			console.error('Logout failed:', error);
			document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
			goto('/login');
		}
	}
</script>

<svelte:head>
	<title>Admin Dashboard &middot; Busy Little Bat Sewing</title>
	<meta name="description" content="Admin dashboard for managing blog posts and content." />
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
		<h2>Access admin controls</h2>

		<a href="/studio" class="studio-btn">Open Admin Controls</a>

		<small class="form-help">
			You'll sign in with your Sanity account to create and edit posts.
		</small>
	</div>
</div>

<style>
	.admin-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem 2rem;

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

						&:hover {
							background: var(--color-dark);
						}
					}
				}
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

			& .form-help {
				display: block;
				margin-top: 1rem;
				color: var(--color-gray);
				font-size: clamp(var(--sm), 1vw, var(--h6));
				line-height: 1.4;
			}

			& .studio-btn {
				display: inline-block;
				margin-top: 1rem;
				padding: 0.75rem 1.5rem;
				border-radius: var(--radius);
				background-color: var(--color-accent);
				color: var(--color-primary);
				font-weight: 600;
				letter-spacing: 1px;
				text-decoration: none;
				transition: background-color 0.2s;

				&:hover {
					background-color: var(--color-primary);
					color: var(--color-accent);
				}
			}
		}
	}
</style>
