<a class="skip-link" href="#main-content"
	>Skip to Main <span class="visually-hidden">content</span></a
>

<style>
	.skip-link {
		position: absolute;
		top: 15em;
		left: 1em;
		border: 2px solid var(--color-secondary);
		border-radius: 5px;
		background-color: var(--color-accent);
		color: var(--color-secondary);
		padding: 0.5rem 0.75rem;
		position: absolute;
		z-index: 6;
		text-decoration: none;
		font-family: var(--font-bold);
		font-size: clamp(0.8rem, 1vw, 0.9rem);
		font-weight: 700;
		letter-spacing: 1px;
	}

	.skip-link:not(:focus) {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		overflow: hidden;
		width: 1px;
		height: 1px;
		white-space: nowrap;
	}

	.skip-link:focus {
		outline: 3px solid var(--dark-pale);
		transform: scale(1.05);
		top: 10em;
		transition: top 0.2s ease-in-out;
	}
</style>
