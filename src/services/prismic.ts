import * as Prismic from '@prismicio/client';

export const prismicClient = (req?: unknown) => {
	const prismic = Prismic.createClient(
		process.env.PRISMIC_REPOSITORY_NAME as string,
		{
			accessToken: process.env.PRISMIC_ACCESS_TOKEN as string,
		}
	);

	return prismic;
};
