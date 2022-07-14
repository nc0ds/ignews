import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { stripe } from '../../services/stripe';
import { fauna } from '../../services/fauna';
import { query as q } from 'faunadb';

interface FaunaUser {
	ref: {
		id: string;
	};
	data: {
		stripe_customer_id: string;
	};
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		res.setHeader('Allow', 'POST');
		return res.status(405).end('Method not allowed');
	}

	const userSession = await getSession({ req });

	const faunaUser = await fauna.query<FaunaUser>(
		q.Get(
			q.Match(
				q.Index('user_by_email'),
				q.Casefold(userSession?.user?.email as string)
			)
		)
	);

	let customerId = faunaUser.data.stripe_customer_id;

	if (!customerId) {
		const stripeCustomer = await stripe.customers.create({
			email: userSession?.user?.email as string,
		});

		await fauna.query(
			q.Update(q.Ref(q.Collection('users'), faunaUser.ref.id), {
				data: {
					stripe_customer_id: stripeCustomer.id,
				},
			})
		);

		customerId = stripeCustomer.id;
	}

	const stripeCheckoutSession = await stripe.checkout.sessions.create({
		customer: customerId,
		payment_method_types: ['card'],
		billing_address_collection: 'required',
		line_items: [
			{
				price: 'price_1LG6erKtFM6r8RxLWrY9cTm3',
				quantity: 1,
			},
		],
		mode: 'subscription',
		allow_promotion_codes: true,
		success_url: process.env.STRIPE_SUCCESS_URL as string,
		cancel_url: process.env.STRIPE_CANCEL_URL as string,
	});

	return res.json({ sessionId: stripeCheckoutSession.id });
};
