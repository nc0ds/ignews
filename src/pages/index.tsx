import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { stripe } from '../services/stripe';

import { SubscribeBtn } from '../components/SubscribeBtn';

import styles from './styles.module.scss';

interface HomePageProps {
	product: {
		price_id: string;
		amount: number;
		amount_formatted: string;
	};
}

const HomePage: NextPage<HomePageProps> = ({ product }) => {
	return (
		<>
			<Head>
				<title>Home | ig.news</title>
			</Head>
			<main className={styles.container}>
				<section>
					<span>👋 Hey, welcome!</span>
					<h1>
						News about the <span>React</span> world
					</h1>
					<p>
						Get access to all the publications <br />
						<span>for {product.amount_formatted}/month</span>
					</p>
					<SubscribeBtn inHome />
				</section>
				<img src='/images/girl.svg' alt='Girl coding' />
			</main>
		</>
	);
};

export const getStaticProps: GetStaticProps = async () => {
	const price = await stripe.prices.retrieve(
		process.env.STRIPE_SUBSCRIPTION_PRICE_ID as string
	);

	const amount_formatted = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format((price.unit_amount as number) / 100);

	const product = {
		price_id: price.id,
		amount_formatted,
		amount: (price.unit_amount as number) / 100,
	};

	return {
		props: {
			product,
		},
		revalidate: 60 * 60 * 24 * 14, // 7 days
	};
};

export default HomePage;
