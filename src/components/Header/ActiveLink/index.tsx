import React, { cloneElement } from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

import styles from './styles.module.scss';

interface ActiveLinkProps extends LinkProps {
	children: React.ReactElement;
}

export const ActiveLink: React.FC<ActiveLinkProps> = ({
	children,
	...linkProps
}) => {
	const { asPath } = useRouter();

	const className = asPath === linkProps.href ? styles.active : '';

	return (
		<Link {...linkProps}>
			{cloneElement(children, {
				className,
			})}
		</Link>
	);
};
