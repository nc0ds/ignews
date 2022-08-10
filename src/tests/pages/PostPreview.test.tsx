import { render, screen } from '@testing-library/react';
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { useSession } from 'next-auth/react';
import { prismicClient } from '../../services/prismic';
import { useRouter } from 'next/router';

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

jest.mock('next/router', () => {
	return {
		useRouter: jest.fn().mockReturnValue({
			push: jest.fn(),
		}),
	};
});

jest.mock('next-auth/react', () => {
	return {
		useSession: jest.fn().mockReturnValue({
			data: {
				email: 'john.doe@gmail.com',
				name: 'John Doe',
				activeSubscription: true,
			},
			status: 'authenticated',
		}),
	};
});

jest.mock('../../services/prismic');

describe('Post Preview slug component', () => {
	it('should render correctly', async () => {
		const useSessionMocked = jest.mocked(useSession);

		useSessionMocked.mockReturnValueOnce({
			data: null,
			status: 'unauthenticated',
		});

		render(<PostPreview post={post} />);

		expect(screen.getByText('Post 1')).toBeInTheDocument();
		expect(screen.getByText('This is the post 1')).toBeInTheDocument();
		expect(screen.getByText('August 08, 2022')).toBeInTheDocument();
	});

	it('should redirect the user if active subscription is found', () => {
		const useRouterPushMocked = jest.fn();

		const useRouterMocked = jest.mocked(useRouter);

		useRouterMocked.mockReturnValue({
			push: useRouterPushMocked,
			query: {
				slug: 'fake-post-slug',
			},
		} as any);

		render(<PostPreview post={post} />);

		expect(useRouterPushMocked).toHaveBeenCalledWith(`/posts/${post.slug}`);
	});

	it('should load post on server side correctly', async () => {
		const prismicClientMocked = jest.mocked(prismicClient);

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

		const response = await getStaticProps({
			params: {
				slug: 'fake-post-slug',
			},
		});

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					post,
				},
			})
		);
	});
});
