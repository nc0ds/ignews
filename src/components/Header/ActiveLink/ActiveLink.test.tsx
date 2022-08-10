import { render, screen } from '@testing-library/react';
import { ActiveLink } from '.';

jest.mock('next/router', () => {
	return {
		useRouter() {
			return {
				asPath: '/',
			};
		},
	};
});

describe('ActiveLink component', () => {
	it('should renders correctly', () => {
		render(
			<ActiveLink href='/'>
				<a>Home</a>
			</ActiveLink>
		);

		expect(screen.getByText('Home')).toBeInTheDocument();
	});

	it("should have active class if it's in the same page as the href passed", () => {
		render(
			<ActiveLink href='/'>
				<a>Home</a>
			</ActiveLink>
		);

		expect(screen.getByText('Home')).toHaveClass('active');
	});
});
