import { render, screen, fireEvent } from '@testing-library/react';
import { signIn, signOut, useSession } from 'next-auth/react';
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

	it('should sign out if already authenticated', () => {
		const useSessionMocked = jest.mocked(useSession);
		const signOutMocked = jest.mocked(signOut);

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

		const loginButton = screen.getByRole('button', { name: /john doe/i });

		fireEvent.click(loginButton);

		expect(signOutMocked).toHaveBeenCalledTimes(1);
	});

	it('should sign in if not authenticated', () => {
		const useSessionMocked = jest.mocked(useSession);
		const signInMocked = jest.mocked(signIn);

		useSessionMocked.mockReturnValueOnce({
			data: null,
			status: 'unauthenticated',
		});

		render(<LoginBtn />);

		const loginButton = screen.getByRole('button', {
			name: /sign in with github/i,
		});

		fireEvent.click(loginButton);

		expect(signInMocked).toHaveBeenCalledTimes(1);
	});
});
