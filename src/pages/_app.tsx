import { useState } from 'react';
import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import '../styles/global.scss';

import { Header } from '../components/Header';
import { MobileNavbar } from '../components/MobileNavbar';

export default function MyApp({ Component, pageProps }: AppProps) {
	const [mobileNavbarOpen, setMobileNavbarOpen] = useState(false);

	const handleOpenMobileNavbar = () => {
		setMobileNavbarOpen(true);
	};

	const handleCloseMobileNavbar = () => {
		setMobileNavbarOpen(false);
	};

	return (
		<SessionProvider session={pageProps.session}>
			<Header onOpenMobileNavbar={handleOpenMobileNavbar} />
			<MobileNavbar
				onCloseMobileNavbar={handleCloseMobileNavbar}
				isOpen={mobileNavbarOpen}
			/>
			<Component {...pageProps} />
		</SessionProvider>
	);
}
