import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { api } from '../../services/api';
import { getStripeJS } from '../../services/stripe-js';

import { SubscribeBtn } from '.';

jest.mock('next-auth/react');
jest.mock('next/router', () => {
	return {
		useRouter: jest.fn().mockReturnValue({
			push: jest.fn(),
		}),
	};
});
jest.mock('../../services/api');
jest.mock('../../services/stripe-js');

describe('SubscribeBtn component in home page', () => {
	it('should render correctly', () => {
		const useSessionMocked = jest.mocked(useSession);

		useSessionMocked.mockReturnValueOnce({
			data: null,
			status: 'unauthenticated',
		});

		render(<SubscribeBtn inHome />);

		expect(screen.getByText('Subscribe now')).toBeInTheDocument();
	});

	it('should redirect the user to sign in page when not authenticated', () => {
		const useSessionMocked = jest.mocked(useSession);

		useSessionMocked.mockReturnValueOnce({
			data: null,
			status: 'unauthenticated',
		});

		const signInMocked = jest.mocked(signIn);

		render(<SubscribeBtn inHome />);

		const subscribeButton = screen.getByText('Subscribe now');

		fireEvent.click(subscribeButton);

		expect(signInMocked).toHaveBeenCalled();
	});

	it('should redirect to posts page when authenticated and have active subscription', () => {
		const useSessionMocked = jest.mocked(useSession);

		useSessionMocked.mockReturnValueOnce({
			data: {
				expires: '',
				user: { email: 'john.doe@gmail.com', name: 'John Doe' },
				activeSubscription: true,
			},
			status: 'authenticated',
		} as any);

		const useRouterPushedMocked = jest.fn();

		const useRouterMocked = jest.mocked(useRouter);

		useRouterMocked.mockReturnValueOnce({
			push: useRouterPushedMocked,
		} as any);

		render(<SubscribeBtn inHome />);

		const subscribeBtn = screen.getByText('Subscribe now');

		fireEvent.click(subscribeBtn);

		expect(useRouterPushedMocked).toHaveBeenCalledWith('/posts');
	});

	it('should call "/subscribe" API requisition', () => {
		const useSessionMocked = jest.mocked(useSession);
		const useRouterPushedMocked = jest.fn();
		const useRouterMocked = jest.mocked(useRouter);
		const apiPostMocked = jest.mocked(api.post);

		useSessionMocked.mockReturnValueOnce({
			data: {
				expires: '',
				user: { email: 'john.doe@gmail.com', name: 'John Doe' },
				activeSubscription: false,
			},
			status: 'authenticated',
		} as any);

		useRouterMocked.mockReturnValueOnce({
			push: useRouterPushedMocked,
		} as any);

		apiPostMocked.mockResolvedValueOnce({
			data: {
				sessionId: 'fake-session-id',
			},
		});

		render(<SubscribeBtn inHome />);

		const subscribeBtn = screen.getByText('Subscribe now');

		fireEvent.click(subscribeBtn);

		expect(apiPostMocked).toHaveBeenCalledTimes(1);
	});

	it('should call "getStripeJS" correctly', () => {
		const useSessionMocked = jest.mocked(useSession);
		const useRouterPushedMocked = jest.fn();
		const useRouterMocked = jest.mocked(useRouter);
		const apiPostMocked = jest.mocked(api.post);
		const stripeMocked = jest.mocked(getStripeJS);

		useSessionMocked.mockReturnValueOnce({
			data: {
				expires: '',
				user: { email: 'john.doe@gmail.com', name: 'John Doe' },
				activeSubscription: false,
			},
			status: 'authenticated',
		} as any);

		useRouterMocked.mockReturnValueOnce({
			push: useRouterPushedMocked,
		} as any);

		apiPostMocked.mockResolvedValueOnce({
			data: {
				sessionId: 'fake-session-id',
			},
		});

		render(<SubscribeBtn inHome />);

		const subscribeBtn = screen.getByText('Subscribe now');

		fireEvent.click(subscribeBtn);

		expect(stripeMocked).toHaveBeenCalledTimes(1);
	});

	it('should redirect to checkout correctly', () => {
		const useSessionMocked = jest.mocked(useSession);
		const useRouterPushedMocked = jest.fn();
		const useRouterMocked = jest.mocked(useRouter);
		const apiPostMocked = jest.mocked(api.post);
		const stripeMocked = jest.mocked(getStripeJS);

		useSessionMocked.mockReturnValueOnce({
			data: {
				expires: '',
				user: { email: 'john.doe@gmail.com', name: 'John Doe' },
				activeSubscription: false,
			},
			status: 'authenticated',
		} as any);

		useRouterMocked.mockReturnValueOnce({
			push: useRouterPushedMocked,
		} as any);

		apiPostMocked.mockResolvedValueOnce({
			data: {
				sessionId: 'fake-session-id',
			},
		});

		const redirectToCheckoutMocked = jest.fn();

		stripeMocked.mockResolvedValueOnce({
			redirectToCheckout: redirectToCheckoutMocked,
		} as any);

		render(<SubscribeBtn inHome />);

		const subscribeBtn = screen.getByText('Subscribe now');

		fireEvent.click(subscribeBtn);

		waitFor(() => expect(redirectToCheckoutMocked).toHaveBeenCalledTimes(1));
	});
});

describe('SubscribeBtn component out of home page', () => {
	it('should render correctly', () => {
		const useSessionMocked = jest.mocked(useSession);

		useSessionMocked.mockReturnValueOnce({
			data: null,
			status: 'unauthenticated',
		});

		render(<SubscribeBtn />);

		expect(screen.getByText(/Wanna continue reading\?/i)).toBeInTheDocument();
	});

	it('should redirect the user to sign in page when not authenticated', () => {
		const useSessionMocked = jest.mocked(useSession);

		useSessionMocked.mockReturnValueOnce({
			data: null,
			status: 'unauthenticated',
		});

		const signInMocked = jest.mocked(signIn);

		render(<SubscribeBtn />);

		const subscribeButton = screen.getByText(/Wanna continue reading\?/i);

		fireEvent.click(subscribeButton);

		expect(signInMocked).toHaveBeenCalled();
	});

	it('should redirect to posts page when authenticated and have active subscription', () => {
		const useSessionMocked = jest.mocked(useSession);

		useSessionMocked.mockReturnValueOnce({
			data: {
				expires: '',
				user: { email: 'john.doe@gmail.com', name: 'John Doe' },
				activeSubscription: true,
			},
			status: 'authenticated',
		} as any);

		const useRouterPushedMocked = jest.fn();

		const useRouterMocked = jest.mocked(useRouter);

		useRouterMocked.mockReturnValueOnce({
			push: useRouterPushedMocked,
		} as any);

		render(<SubscribeBtn />);

		const subscribeBtn = screen.getByText(/Wanna continue reading\?/i);

		fireEvent.click(subscribeBtn);

		expect(useRouterPushedMocked).toHaveBeenCalledWith('/posts');
	});
});
