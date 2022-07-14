import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

import styles from './styles.module.scss';

import { AiOutlineGithub, AiOutlineClose } from 'react-icons/ai';

export const LoginBtn: React.FC = () => {
	const { data, status } = useSession();

	const handleClick = () => {
		if (status === 'authenticated') return signOut();

		return signIn('github');
	};

	return (
		<button type='button' className={styles.container} onClick={handleClick}>
			<AiOutlineGithub
				color={status === 'authenticated' ? '#04D361' : '#EBA417'}
			/>
			<span>
				{status === 'authenticated' ? data.user?.name : 'Sign in with Github'}
			</span>
			{status === 'authenticated' ? <AiOutlineClose /> : null}
		</button>
	);
};
