import { render, screen } from '@testing-library/react';
import HomePage, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';

interface HomePageProductsType {
	price_id: string;
	amount: number;
	amount_formatted: string;
}

jest.mock('next-auth/react', () => {
	return {
		useSession: jest.fn().mockReturnValue({
			data: null,
			status: 'unauthenticated',
		}),
	};
});

jest.mock('next/router', () => {
	return {
		useRouter: jest.fn().mockReturnValue({
			push: jest.fn(),
		}),
	};
});

jest.mock('../../services/stripe');

describe('Home page', () => {
	it('should render the price correctly', () => {
		const product: HomePageProductsType = {
			price_id: 'fake-price-id',
			amount: 9.9,
			amount_formatted: '$9.90',
		};

		render(<HomePage product={product} />);

		expect(screen.getByText(/\$9.90/i)).toBeInTheDocument();
	});

	it('should load inital information', async () => {
		const stripePricesRetrieveMocked = jest.mocked(stripe.prices.retrieve);

		stripePricesRetrieveMocked.mockResolvedValueOnce({
			id: 'fake-price-id',
			unit_amount: 1000,
		} as any);

		const response = await getStaticProps({});

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					product: {
						price_id: 'fake-price-id',
						amount: 10,
						amount_formatted: '$10.00',
					},
				},
			})
		);
	});
});
