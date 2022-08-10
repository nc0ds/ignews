import { render, screen } from '@testing-library/react';
import { prismicClient } from '../../services/prismic';
import Posts, { getStaticProps } from '../../pages/posts';

interface PostType {
	slug: string;
	title: string;
	summary: string;
	updatedAt: string;
}

const posts: PostType[] = [
	{
		slug: 'fake-post-slug',
		title: 'Post 1',
		summary: 'This is the post 1',
		updatedAt: 'August 08, 2022',
	},
	{
		slug: 'fake-post-slug2',
		title: 'Post 2',
		summary: 'This is the post 2',
		updatedAt: 'August 09, 2022',
	},
];

jest.mock('../../services/prismic');

describe('Posts page', () => {
	it('should render the post list correctly', () => {
		render(<Posts posts={posts} />);

		expect(screen.getByText('August 08, 2022')).toBeInTheDocument();
		expect(screen.getByText('August 09, 2022')).toBeInTheDocument();
		expect(screen.getByText('Post 1')).toBeInTheDocument();
		expect(screen.getByText('Post 2')).toBeInTheDocument();
		expect(screen.getByText('This is the post 1')).toBeInTheDocument();
		expect(screen.getByText('This is the post 2')).toBeInTheDocument();
	});

	it('should load the posts from server side correctly', async () => {
		const prismicGetMocked = jest.mocked(prismicClient);

		prismicGetMocked.mockReturnValueOnce({
			getAllByType: jest.fn().mockResolvedValueOnce([
				{
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
				},
				{
					uid: 'fake-post-slug2',
					data: {
						title: [
							{
								type: 'heading',
								text: 'Post 2',
							},
						],
						content: [
							{
								type: 'paragraph',
								text: 'This is the post 2',
							},
						],
					},
					last_publication_date: '08-09-2022',
				},
			]),
		} as any);

		const response = await getStaticProps({});

		expect(response).toEqual(
			expect.objectContaining({
				props: {
					posts,
				},
			})
		);
	});
});
