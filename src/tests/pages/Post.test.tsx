import { render, screen } from '@testing-library/react';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { useSession, getSession } from 'next-auth/react';
import { prismicClient } from '../../services/prismic';

interface PostType {
	slug: string;
	title: string;
	content: string;
	updatedAt: string;
}

const post: PostType = {
	slug: 'fake-post-slug',
	title: 'Post 1',
	content: '<p>This is the post 1</p>',
	updatedAt: 'August 08, 2022',
};

jest.mock('next-auth/react');
jest.mock('../../services/prismic');

describe('Post slug page', () => {
	it('should render correctly', () => {
		const useSessionMocked = jest.mocked(useSession);

		useSessionMocked.mockReturnValueOnce({
			data: {
				user: {
					email: 'john.doe@gmail.com',
					name: 'John Doe',
				},
			},
			status: 'authenticated',
			activeSubscription: true,
		} as any);

		render(<Post post={post} />);

		expect(screen.getByText('Post 1')).toBeInTheDocument();
		expect(screen.getByText('This is the post 1')).toBeInTheDocument();
		expect(screen.getByText('August 08, 2022')).toBeInTheDocument();
	});

	it('should redirect the user to preview page if no active subscription is found', async () => {
		const response = await getServerSideProps({
			req: {
				cookies: {},
			},
			params: {
				slug: 'fake-post-slug',
			},
		} as any);

		expect(response).toEqual(
			expect.objectContaining({
				redirect: {
					destination: `/posts/preview/${post.slug}`,
					permanent: false,
				},
			})
		);
	});

	it('should load the initial information', async () => {
		const getSessionMocked = jest.mocked(getSession);
		const prismicClientMocked = jest.mocked(prismicClient);

		getSessionMocked.mockResolvedValueOnce({
			activeSubscription: true,
		} as any);

		prismicClientMocked.mockReturnValueOnce({
			getByUID: jest.fn().mockResolvedValueOnce({
				uid: 'fake-post-slug',
				data: {
					title: [
						{
							type: 'heading',
							text: 'Post 1',
						},
					],
					content: [
						{
							type: 'paragraph',
							text: 'This is the post 1',
						},
					],
				},
				last_publication_date: '08-08-2022',
			}),
		} as any);

		const response = await getServerSideProps({
			params: {
				slug: 'fake-post-slug',
			},
		} as any);

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					post,
				},
			})
		);
	});
});
