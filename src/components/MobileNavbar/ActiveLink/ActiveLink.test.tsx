import { render, screen } from '@testing-library/react';
import { ActiveLink } from '.';

jest.mock('next/router', () => {
	return {
		useRouter: jest.fn().mockReturnValue({
			asPath: '/',
		}),
	};
});

describe('MobileNavbar ActiveLink component', () => {
	it('should render correctly', () => {
		render(
			<ActiveLink href='/'>
				<a>Home</a>
			</ActiveLink>
		);

		expect(screen.getByText('Home')).toBeInTheDocument();
	});

	it('should have active class when in the same page as href', () => {
		render(
			<ActiveLink href='/'>
				<a>Home</a>
			</ActiveLink>
		);

		const activeLink = screen.getByText('Home');

		expect(activeLink).toHaveClass('active');
	});
});
