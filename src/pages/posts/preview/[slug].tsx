import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';

import { useSession } from 'next-auth/react';

import { prismicClient } from '../../../services/prismic';
import { RichText } from 'prismic-dom';

import styles from './styles.module.scss';
import { SubscribeBtn } from '../../../components/SubscribeBtn';

interface PostPreviewProps {
	post: {
		slug: string;
		title: string;
		content: string;
		updatedAt: string;
	};
}

const PostPreview: React.FC<PostPreviewProps> = ({ post }) => {
	const { data } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (data?.activeSubscription) {
			router.push(`/posts/${router.query.slug}`);
		}
	}, [data]);

	return (
		<>
			<Head>
				<title>{post.title} | ig.news</title>
			</Head>
			<main className={styles.container}>
				<article>
					<h1>{post.title}</h1>
					<time dateTime={post.updatedAt}>{post.updatedAt}</time>
					<div
						className={styles.preview}
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>
					<SubscribeBtn />
				</article>
			</main>
		</>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const { slug } = params as { [key: string]: string };

	const prismic = prismicClient();

	const rawPost = await prismic.getByUID('post', String(slug), {});

	const post = {
		slug,
		title: RichText.asText(rawPost.data.title),
		content: RichText.asHtml(rawPost.data.content.splice(0, 4)),
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
		revalidate: 60 * 60 * 24, //24h
	};
};

export default PostPreview;
