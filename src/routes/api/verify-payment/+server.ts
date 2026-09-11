import { json } from '@sveltejs/kit';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
		const { sessionId } = (await request.json()) as { sessionId: string };

		if (!sessionId) {
			return json({ error: 'No session ID provided' }, { status: 400 });
		}

		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === 'paid') {
			return json({ success: true, session });
		} else {
			return json({ success: false }, { status: 400 });
		}
	} catch (error) {
		console.error('Payment verification error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 }
		);
	}
};
