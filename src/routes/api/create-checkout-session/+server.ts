import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';
import type { CartItem } from '$lib/types';

export const POST: RequestHandler = async ({ request, url }) => {
	try {
		console.log('Creating checkout session...');

		const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
		const { items, customerEmail } = (await request.json()) as {
			items: (CartItem & { stripe_price_id?: string; description?: string })[];
			customerEmail?: string;
		};

		if (!items || items.length === 0) {
			console.error('No items in cart');
			return json({ error: 'No items in cart' }, { status: 400 });
		}

		// Format line items for Stripe - use existing Price IDs when available
		const lineItems = items.map((item) => {
			console.log('Processing item for Stripe:', item); // Debug log

			// Log size information for debugging
			if (item.size) {
				console.log(`Item ${item.name} has size: ${item.size}`);
			}

			// Check if item has a Stripe Price ID and NO size - use existing price if no size
			if (item.stripe_price_id && !item.size) {
				console.log(`Using existing Stripe Price ID for ${item.name}:`, item.stripe_price_id);
				return {
					price: item.stripe_price_id,
					quantity: item.quantity
				};
			}

			// Fallback: Create product dynamically (for items without Stripe Price IDs OR items with sizes)
			if (item.size) {
				console.log(`Creating dynamic product for ${item.name} with size ${item.size}`);
			} else {
				console.log(`Creating dynamic product for ${item.name} (no Stripe Price ID found)`);
			}

			// Create product data object with size information if available
			const productName = item.size ? `${item.name} - Size ${item.size}` : item.name;
			console.log(`Product name for Stripe: "${productName}"`); // Debug log

			const productData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData.ProductData = {
				name: productName,
				tax_code: 'txcd_35010000' // Tax code for general clothing
			};

			// Convert relative URL to absolute if needed
			if (item.imageUrl) {
				let imageUrl: string | undefined;
				if (item.imageUrl.startsWith('/')) {
					imageUrl = `${url.origin}${item.imageUrl}`;
				} else if (isValidHttpUrl(item.imageUrl)) {
					imageUrl = item.imageUrl;
				}

				// For development/localhost, use a placeholder image since Stripe can't access local files
				if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
					// Use higher resolution placeholder for development (1200x1200)
					productData.images = [`https://picsum.photos/1200/1200?random=${item.id}`];
					console.log('Using high-res placeholder image for development:', productData.images[0]);
				} else if (imageUrl) {
					productData.images = [imageUrl];
					console.log('Added image to Stripe product:', imageUrl);
				}
			} else {
				console.log('No imageUrl found for item:', item.name); // Debug log
			}

			// Only add description if it exists and isn't empty
			if (item.description && item.description.trim() !== '') {
				// Clean up HTML from description for Stripe (Stripe doesn't support HTML)
				let cleanDescription = item.description
					.replace(/<[^>]*>/g, '') // Remove HTML tags
					.replace(/&middot;/g, '·') // Replace HTML entities
					.replace(/&nbsp;/g, ' ')
					.trim();

				// Add size information to description if available
				if (item.size) {
					cleanDescription = `Size: ${item.size}\n\n${cleanDescription}`;
				}

				productData.description = cleanDescription;
			} else if (item.size) {
				// If no description but has size, just show size
				productData.description = `Size: ${item.size}`;
			}

			return {
				price_data: {
					currency: 'usd',
					product_data: productData,
					unit_amount: Math.round((item.price ?? 0) * 100),
					tax_behavior: 'exclusive' as const
				},
				quantity: item.quantity
			};
		});

		console.log('Creating Stripe session...');
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: lineItems,
			mode: 'payment',
			shipping_address_collection: {
				allowed_countries: ['US', 'CA']
			},
			shipping_options: [
				{
					shipping_rate_data: {
						type: 'fixed_amount',
						fixed_amount: {
							amount: 1000,
							currency: 'usd'
						},
						display_name: 'USPS Ground',
						delivery_estimate: {
							minimum: {
								unit: 'business_day',
								value: 5
							},
							maximum: {
								unit: 'business_day',
								value: 7
							}
						},
						tax_behavior: 'exclusive' as const
					}
				}
			],
			automatic_tax: {
				enabled: true
			},
			billing_address_collection: 'required',
			success_url:
				new URL('/checkout/success', url.origin).toString() + '?session_id={CHECKOUT_SESSION_ID}',
			cancel_url: new URL('/checkout/canceled', url.origin).toString(),
			customer_email: customerEmail || undefined
		});

		console.log('Session created:', session.id);
		return json({ sessionId: session.id });
	} catch (error) {
		console.error('Stripe checkout error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
};

// Helper function to validate URLs
function isValidHttpUrl(string: string): boolean {
	try {
		const url = new URL(string);
		return url.protocol === 'http:' || url.protocol === 'https:';
	} catch {
		return false;
	}
}
