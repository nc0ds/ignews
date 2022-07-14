import React, { cloneElement } from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

import styles from './styles.module.scss';

interface ActiveLinkProps extends LinkProps {
	children: React.ReactElement;
}

export const ActiveLink: React.FC<ActiveLinkProps> = ({
	children,
	...rest
}) => {
	const router = useRouter();

	const className =
		router.asPath === rest.href ? styles.active : styles.inactive;

	return (
		<Link {...rest}>
			{cloneElement(children, {
				className,
			})}
		</Link>
	);
};
