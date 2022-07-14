import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_API_PRIVATE_KEY as string, {
	apiVersion: '2020-08-27',
	appInfo: {
		name: 'ignews',
		version: '0.0.1',
	},
});
