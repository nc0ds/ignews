import React from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';

import { RichText } from 'prismic-dom';
import { prismicClient } from '../../services/prismic';

import styles from './styles.module.scss';

import { PostItem } from '../../components/PostItem';

interface PostsProps {
	posts: Array<{
		slug: string;
		title: string;
		summary: string;
		updatedAt: string;
	}>;
}

const Posts: React.FC<PostsProps> = ({ posts }) => {
	return (
		<>
			<Head>
				<title>Posts | ig.news</title>
			</Head>
			<main className={styles.container}>
				{posts.map((item) => (
					<PostItem post={item} key={item.slug} />
				))}
			</main>
		</>
	);
};

export const getStaticProps: GetStaticProps = async () => {
	const prismic = prismicClient();

	const response = await prismic.getAllByType('post', {
		fetch: ['post.title', 'post.content'],
		pageSize: 10,
	});

	const posts = response.map((item) => {
		return {
			slug: item.uid,
			title: RichText.asText(item.data.title),
			summary:
				item.data.content.find((content: any) => content.type === 'paragraph')
					?.text ?? '',
			updatedAt: new Date(item.last_publication_date).toLocaleDateString(
				'en-US',
				{
					day: '2-digit',
					month: 'long',
					year: 'numeric',
				}
			),
		};
	});

	return {
		props: {
			posts,
		},
		revalidate: 60 * 60 * 24, //24h
	};
};

export default Posts;
