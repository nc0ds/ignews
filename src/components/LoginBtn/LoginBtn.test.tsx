import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { LoginBtn } from '.';

jest.mock('next-auth/react');

describe('LoginBtn component', () => {
	it('should render correctly when user is not authenticated', () => {
		const useSessionMocked = jest.mocked(useSession);

		useSessionMocked.mockReturnValueOnce({
			data: null,
			status: 'unauthenticated',
		});

		render(<LoginBtn />);

		expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
	});

	it('should render correctly when user is authenticated', () => {
		const useSessionMocked = jest.mocked(useSession);

		useSessionMocked.mockReturnValueOnce({
			data: {
				user: {
					email: 'john.doe@gmail.com',
					name: 'John Doe',
				},
				expires: '',
			},
			status: 'authenticated',
		});

		render(<LoginBtn />);

		expect(screen.getByText('John Doe')).toBeInTheDocument();
	});
});
