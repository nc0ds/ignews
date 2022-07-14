import React from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';

import { api } from '../../services/api';

import styles from './styles.module.scss';
import { getStripeJS } from '../../services/stripe-js';

interface SubscribeBtnProps {
	inHome?: boolean;
}

export const SubscribeBtn: React.FC<SubscribeBtnProps> = ({
	inHome = false,
}) => {
	const { data, status } = useSession();
	const router = useRouter();

	const handleSubscribe = async () => {
		if (status !== 'authenticated') {
			signIn('github');
			return;
		}

		if (data.activeSubscription) {
			return router.push('/posts');
		}

		try {
			const { data } = await api.post('/subscribe');
			const { sessionId } = data;

			const stripe = await getStripeJS();

			await stripe?.redirectToCheckout({
				sessionId,
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<button
			type='button'
			className={!inHome ? styles.containerOutHome : styles.containerInHome}
			onClick={handleSubscribe}
		>
			{!inHome && 'Wanna continue reading?'} <span>Subscribe now</span>{' '}
			{!inHome && '🤗'}
		</button>
	);
};
