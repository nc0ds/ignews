import React from 'react';

import styles from './styles.module.scss';

import { LoginBtn } from '../LoginBtn';
import { ActiveLink } from './ActiveLink';

import { AiOutlineMenu } from 'react-icons/ai';
import Link from 'next/link';

interface HeaderProps {
	onOpenMobileNavbar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNavbar }) => {
	return (
		<header className={styles.container}>
			<div>
				<button
					type='button'
					onClick={onOpenMobileNavbar}
					className={styles.mobileNavbarButton}
				>
					<AiOutlineMenu />
				</button>
				<Link href='/'>
					<a>
						<img src='/images/logo.svg' alt='ignews' />
					</a>
				</Link>
				<nav>
					<ul>
						<li>
							<ActiveLink href='/'>
								<a>Home</a>
							</ActiveLink>
						</li>
						<li>
							<ActiveLink href='/posts'>
								<a>Posts</a>
							</ActiveLink>
						</li>
					</ul>
				</nav>
				<LoginBtn />
			</div>
		</header>
	);
};
