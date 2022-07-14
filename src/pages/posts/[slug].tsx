import React from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { getSession } from 'next-auth/react';

import { prismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';

import styles from './post.module.scss';

interface PostProps {
	post: {
		slug: string;
		title: string;
		content: string;
		updatedAt: string;
	};
}

const Post: React.FC<PostProps> = ({ post }) => {
	return (
		<>
			<Head>
				<title>{post.title} | ig.news</title>
			</Head>
			<main className={styles.container}>
				<article>
					<h1>{post.title}</h1>
					<time dateTime={post.updatedAt}>{post.updatedAt}</time>
					<div dangerouslySetInnerHTML={{ __html: post.content }} />
				</article>
			</main>
		</>
	);
};

export const getServerSideProps: GetServerSideProps = async ({
	req,
	params,
}) => {
	const session = await getSession({ req });
	const { slug } = params as { [key: string]: string };

	if (!session || !session.activeSubscription) {
		return {
			redirect: {
				destination: `/posts/preview/${slug}`,
				permanent: false,
			},
		};
	}

	const prismic = prismicClient(req);

	const rawPost = await prismic.getByUID('post', String(slug), {});

	const post = {
		slug,
		title: RichText.asText(rawPost.data.title),
		content: RichText.asHtml(rawPost.data.content),
		updatedAt: new Date(rawPost.last_publication_date).toLocaleDateString(
			'en-US',
			{
				day: '2-digit',
				month: 'long',
				year: 'numeric',
			}
		),
	};

	return {
		props: {
			post,
		},
	};
};

export default Post;
