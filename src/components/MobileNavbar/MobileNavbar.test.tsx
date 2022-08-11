import { fireEvent, render, screen } from '@testing-library/react';
import { MobileNavbar } from '.';

jest.mock('next/router', () => {
	return {
		useRouter: jest.fn().mockReturnValue({
			asPath: '/',
		}),
	};
});

describe('MobileNavbar component', () => {
	it('should render correctly', () => {
		const onCloseMobileNavbar = jest.fn();

		render(
			<MobileNavbar isOpen={true} onCloseMobileNavbar={onCloseMobileNavbar} />
		);

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Posts')).toBeInTheDocument();
	});

	it('should have home page link activated', () => {
		const onCloseMobileNavbar = jest.fn();

		render(
			<MobileNavbar isOpen={true} onCloseMobileNavbar={onCloseMobileNavbar} />
		);

		const homeLink = screen.getByText('Home');

		expect(homeLink).toHaveClass('active');
	});

	it('should have opened class when open', () => {
		const onCloseMobileNavbar = jest.fn();

		const { container } = render(
			<MobileNavbar isOpen={true} onCloseMobileNavbar={onCloseMobileNavbar} />
		);

		const overlay = container.querySelector('.overlay');
		const aside = container.querySelector('.overlay > aside');

		expect(overlay).toHaveClass('overlay-opened');
		expect(aside).toHaveClass('container-opened');
	});

	it('should have closed class when closed', () => {
		const onCloseMobileNavbar = jest.fn();

		const { container } = render(
			<MobileNavbar isOpen={false} onCloseMobileNavbar={onCloseMobileNavbar} />
		);

		const overlay = container.querySelector('.overlay');
		const aside = container.querySelector('.overlay > aside');

		expect(overlay).not.toHaveClass('overlay-opened');
		expect(aside).not.toHaveClass('container-opened');
	});

	it('should stop propagation when clicked inside "aside" element', () => {
		const onCloseMobileNavbar = jest.fn();

		const { container } = render(
			<MobileNavbar isOpen={true} onCloseMobileNavbar={onCloseMobileNavbar} />
		);

		const aside = container.querySelector('.overlay > aside') as any;

		fireEvent.click(aside);

		expect(aside).toHaveClass('container-opened');
	});
});
