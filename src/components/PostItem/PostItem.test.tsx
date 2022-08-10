import { render, screen } from '@testing-library/react';
import { PostItem } from '.';

interface PostType {
	slug: string;
	title: string;
	summary: string;
	updatedAt: string;
}

describe('PostItem component', () => {
	it('should render correctly', () => {
		const post: PostType = {
			slug: 'post1',
			summary: 'Testing PostItem component',
			title: 'Testing PostItem',
			updatedAt: '08/08/2022',
		};

		render(<PostItem post={post} />);

		expect(screen.getByText('Testing PostItem')).toBeInTheDocument();
		expect(screen.getByText('Testing PostItem component')).toBeInTheDocument();
	});
});
