import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';
import { stripe } from '../../../services/stripe';

interface ManageSubscriptionProps {
	customerId: string;
	subscriptionId: string;
	isCreate?: boolean;
}

export async function manageSubscription({
	customerId,
	subscriptionId,
	isCreate = false,
}: ManageSubscriptionProps) {
	const userRef = await fauna.query(
		q.Select(
			['ref'],
			q.Get(q.Match(q.Index('user_by_stripe_customer_id'), customerId))
		)
	);

	const subscription = await stripe.subscriptions.retrieve(subscriptionId);

	const subscriptionData = {
		id: subscription.id,
		userId: userRef,
		status: subscription.status,
		price_id: subscription.items.data[0].price.id,
	};

	return await fauna.query(
		q.If(
			q.Not(q.Exists(q.Match(q.Index('subscription_by_user_id'), userRef))),
			q.Create(q.Collection('subscriptions'), {
				data: subscriptionData,
			}),
			q.Replace(
				q.Select(
					'ref',
					q.Get(q.Match(q.Index('subscription_by_user_id'), userRef))
				),
				{
					data: subscriptionData,
				}
			)
		)
	);
}
