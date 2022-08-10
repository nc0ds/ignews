import { render, screen } from '@testing-library/react';
import { MobileNavbar } from '.';

jest.mock('next/router', () => {
	return {
		useRouter: jest.fn().mockReturnValue({
			asPath: '/',
		}),
	};
});

describe('MobileNavbar component', () => {
	it('should render correctly', () => {
		const onCloseMobileNavbar = jest.fn();

		render(
			<MobileNavbar isOpen={true} onCloseMobileNavbar={onCloseMobileNavbar} />
		);

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Posts')).toBeInTheDocument();
	});

	it('should have home page link activated', () => {
		const onCloseMobileNavbar = jest.fn();

		render(
			<MobileNavbar isOpen={true} onCloseMobileNavbar={onCloseMobileNavbar} />
		);

		const homeLink = screen.getByText('Home');

		expect(homeLink).toHaveClass('active');
	});
});
