import React from 'react';

import { ActiveLink } from './ActiveLink';
import { AiOutlineClose } from 'react-icons/ai';

import styles from './styles.module.scss';

interface MobileNavbar {
	isOpen: boolean;
	onCloseMobileNavbar: () => void;
}

export const MobileNavbar: React.FC<MobileNavbar> = ({
	isOpen,
	onCloseMobileNavbar,
}) => {
	return (
		<div
			className={`${styles.overlay} ${
				isOpen ? styles['overlay-opened'] : styles['overlay-closed']
			}`}
			onClick={onCloseMobileNavbar}
		>
			<aside
				className={`${styles.container} ${
					isOpen ? styles['container-opened'] : styles['container-closed']
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<button type='button' onClick={onCloseMobileNavbar}>
					<AiOutlineClose />
				</button>
				<nav>
					<ul>
						<li>
							<ActiveLink href='/'>
								<a onClick={onCloseMobileNavbar}>Home</a>
							</ActiveLink>
						</li>
						<li>
							<ActiveLink href='/posts'>
								<a onClick={onCloseMobileNavbar}>Posts</a>
							</ActiveLink>
						</li>
					</ul>
				</nav>
			</aside>
		</div>
	);
};
