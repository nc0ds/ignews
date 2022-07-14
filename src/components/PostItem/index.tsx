import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

import styles from './styles.module.scss';

interface PostItemProps {
	post: {
		slug: string;
		title: string;
		summary: string;
		updatedAt: string;
	};
}

export const PostItem: React.FC<PostItemProps> = ({ post }) => {
	const { data, status } = useSession();

	return (
		<div>
			<Link
				href={`/posts/${!data?.activeSubscription ? 'preview/' : ''}${
					post.slug
				}`}
			>
				<a className={styles.cardContainer}>
					<time dateTime={post.updatedAt}>{post.updatedAt}</time>
					<strong>{post.title}</strong>
					<p>{post.summary}</p>
				</a>
			</Link>
		</div>
	);
};
