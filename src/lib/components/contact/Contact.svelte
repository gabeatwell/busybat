<script lang="ts">
	import SendButton from '$lib/components/layout/SendButton.svelte';
	import VerticalTitle from '$lib/components/layout/VerticalTitle.svelte';

	let name = $state('');
	let email = $state('');
	let message = $state('');
</script>

<VerticalTitle title="Contact" />

<div class="content">
	<div class="form-container">
		<div
			role="status"
			aria-live="polite"
			aria-atomic="true"
			class="visually-hidden"
			id="form-status"
		>
			<!-- Screen reader announcements will go here -->
		</div>
		<form method="POST" action="https://form.taxi/s/226lrszc">
			<fieldset>
				<p>
					<span class="visually-hidden">contact form</span>
				</p>

				<legend>Message Us</legend>

				<label for="name">Name:</label>
				<input
					type="text"
					id="name"
					name="name"
					bind:value={name}
					required
					aria-describedby="name-help"
				/>
				<div id="name-help" class="visually-hidden">Please enter your full name</div>

				<label for="email">Email:</label>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={email}
					required
					aria-describedby="email-help"
				/>
				<div id="email-help" class="visually-hidden">Please enter a valid email address</div>

				<label for="message">Message:</label>
				<textarea
					name="message"
					id="message"
					cols="30"
					rows="10"
					bind:value={message}
					required
					aria-describedby="message-help"
				></textarea>
				<div id="message-help" class="visually-hidden">Please enter your message or question</div>

				<div class="send">
					<SendButton title="Send" />
				</div>
			</fieldset>
		</form>
	</div>
</div>

<style>
	.content {
		display: flex;
		width: 100%;
		overflow-y: auto;
		min-height: 100vh;

		@media (width <= 768px) {
			width: 100vw;
			padding: 0;
			min-height: auto;
			justify-content: center;
			align-items: center;
		}

		& .form-container {
			display: flex;
			justify-content: center;
			align-items: center;
			overflow: visible;
			position: relative;
			width: 100%;
			min-height: 100vh;

			& form {
				display: flex;
				flex-direction: column;
				gap: 1rem;
				width: min(85%, 1500px);
				margin-inline: auto;
				transform: translateY(0);
				scale: 1;

				& fieldset {
					border: none;
					padding: 0;
					margin: 0;
					display: flex;
					flex-direction: column;
					border: 2px solid var(--color-gray);
					border-radius: var(--radius);
					gap: inherit;
					width: 100%;
					padding: 2em;
					box-sizing: border-box;
					position: relative;
					background-color: var(--color-white);

					& legend {
						color: var(--color-dark);
						font-family: var(--font-bold);
						font-size: clamp(var(--h5), 2vw, var(--h4));
						text-align: left;
						letter-spacing: -1px;
						padding-inline: 1rem;

						@media (width <= 500px) {
							transform: none;
						}
					}

					@media (width <= 500px) {
						border: none;
					}
				}
				& label {
					color: var(--color-gray);
					font-family: var(--font-semibold);
					font-size: clamp(var(--h6), 2vw, var(--h5));
					letter-spacing: 0px;
					background: var(--color-white);
					color: var(--color-secondary);
					transform: translate(20px, 34px);
					z-index: 5;
					width: fit-content;
					padding: 0 0.5rem;

					@media (width <= 500px) {
						transform: translate(20px, 30px);
					}
				}
				& input,
				& textarea {
					font-family: var(--font-regular);
					font-size: clamp(var(--h6), 2vw, var(--h4));
					padding-block: 0.1rem;
					border-radius: calc(var(--radius) * 1.75);
					width: 100%;
					box-sizing: border-box;

					background-color: rgba(255, 255, 255, 0.9);
					backdrop-filter: blur(8px);
					border: 2px solid rgba(255, 255, 255, 0.3);
					box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
					outline: none;
					transition: all 0.3s ease-in-out;

					@media (width <= 768px) {
						font-size: 1rem;
						width: 100%;
						box-sizing: border-box;
					}

					@media (width <= 500px) {
						transform: none;
						font-size: 0.9rem;
					}
				}

				& input {
					padding-inline: 1rem;
					border: 1px solid var(--color-secondary);
					padding-block: 0.5rem;

					&:user-valid {
						outline: 2px solid var(--color-success);
						box-shadow: 0 0 0 2px var(--color-success);
					}

					&:user-invalid {
						outline: 2px solid var(--color-danger);
						box-shadow: 0 0 0 2px var(--color-danger);
					}

					&:focus {
						border: 2px solid rgba(255, 255, 255, 0.3);
						box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
					}
				}

				& .send {
					margin-bottom: 2rem;
					margin-top: 1rem;

					@media (width <= 500px) {
						transform: none;
						scale: 1.2;
						margin-top: 1.5rem;
						margin-bottom: 2rem;
					}
				}

				& textarea {
					padding-inline: 1rem;
					border: 1px solid var(--color-secondary);
					padding-block: 0.5rem;

					&:user-valid {
						outline: 2px solid var(--color-success);
						box-shadow: 0 0 0 2px var(--color-success);
					}

					&:user-invalid {
						outline: 2px solid var(--color-danger);
						box-shadow: 0 0 0 2px var(--color-danger);
					}

					&:focus {
						border: 2px solid rgba(255, 255, 255, 0.3);
						box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
					}

					@media (width <= 768px) {
						height: 80px;
						min-height: 80px;
						rows: 4;
					}
				}

				@media (width <= 1950px) {
					scale: 0.9;
					margin-block: 0;
					padding-top: 0;
				}

				@media (width <= 1150px) {
					width: min(80%, 1200px);
					padding-bottom: 2.5rem;
					margin-inline: auto;
					padding-top: 0;
				}

				@media (width <= 980px) {
					width: min(85%, 900px);
				}
				@media (width <= 768px) {
					width: 100%;
					max-width: none;
					transform: translateY(0);
					margin: 0;
					scale: 1;
					box-sizing: border-box;
					padding: 0;

					& fieldset {
						padding: 1rem;
						width: 90%;
						max-width: 500px;
						margin: 0 auto;
						box-sizing: border-box;
						box-shadow: none;
						border: none;
						position: relative;
						z-index: 1;

						& legend {
							position: relative;
							z-index: 2;
							background-color: var(--color-white);
							padding-inline: 1rem;
							padding-block: 0.5rem;
							margin-bottom: 1rem;
						}
					}
				}

				@media (width <= 500px) {
					width: 100%;
					max-width: none;
					transform: translateY(0);
					margin: 0;
					margin-top: 0;
					scale: 1;
					position: relative;
					left: 0;

					& fieldset {
						padding: 0.75rem;
						padding-top: 0;
						width: 95%;
						max-width: 400px;
						margin: 0 auto;

						& legend {
							position: relative;
							z-index: 2;
							background-color: var(--color-white);
							padding-inline: 1rem;
							padding-block: 0.5rem;
							margin-bottom: 0;
						}
					}
				}
			}

			@media (width <= 768px) {
				width: 100%;
				min-width: 325px;
				min-height: 100vh;
				height: auto;
				overflow-y: visible;
				box-sizing: border-box;
				align-items: center;
				justify-content: center;
				transform: translateY(0);
				margin: 0;
				padding: 1rem;
				margin-right: 2em;
			}
		}
	}
</style>
