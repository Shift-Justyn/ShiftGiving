import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { MediaGallery } from './MediaGallery';
import { mockTheme } from '../../test-utils/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

describe('MediaGallery', () => {
  const mockImages = [
    { url: 'https://example.com/image1.jpg', caption: 'Test Caption 1' },
    { url: 'https://example.com/image2.jpg', caption: 'Test Caption 2' },
    { url: 'https://example.com/image3.jpg' },
  ];

  it('renders nothing when images array is empty', () => {
    const { container } = renderWithTheme(<MediaGallery images={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders gallery with images', () => {
    renderWithTheme(<MediaGallery images={mockImages} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
  });

  it('displays image captions', () => {
    renderWithTheme(<MediaGallery images={mockImages} />);
    expect(screen.getByText(/Test Caption 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Caption 2/i)).toBeInTheDocument();
  });

  it('opens lightbox when image is clicked', () => {
    renderWithTheme(<MediaGallery images={mockImages} />);
    const images = screen.getAllByRole('img');
    fireEvent.click(images[0]);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes lightbox when close button is clicked', () => {
    renderWithTheme(<MediaGallery images={mockImages} />);
    const images = screen.getAllByRole('img');
    fireEvent.click(images[0]);

    const closeButton = screen.getByLabelText(/Close lightbox/i);
    fireEvent.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('navigates to next image in lightbox', () => {
    renderWithTheme(<MediaGallery images={mockImages} />);
    const images = screen.getAllByRole('img');
    fireEvent.click(images[0]);

    const nextButton = screen.getByLabelText(/Next image/i);
    fireEvent.click(nextButton);

    const lightboxImages = screen.getAllByRole('img');
    expect(lightboxImages[lightboxImages.length - 1]).toHaveAttribute(
      'src',
      'https://example.com/image2.jpg'
    );
  });

  it('navigates to previous image in lightbox', () => {
    renderWithTheme(<MediaGallery images={mockImages} />);
    const images = screen.getAllByRole('img');
    fireEvent.click(images[1]);

    const prevButton = screen.getByLabelText(/Previous image/i);
    fireEvent.click(prevButton);

    const lightboxImages = screen.getAllByRole('img');
    expect(lightboxImages[lightboxImages.length - 1]).toHaveAttribute(
      'src',
      'https://example.com/image1.jpg'
    );
  });

  it('displays image counter in lightbox', () => {
    renderWithTheme(<MediaGallery images={mockImages} />);
    const images = screen.getAllByRole('img');
    fireEvent.click(images[0]);

    expect(screen.getByText(/1 \/ 3/i)).toBeInTheDocument();
  });

  it('wraps around to last image when clicking previous on first image', () => {
    renderWithTheme(<MediaGallery images={mockImages} />);
    const images = screen.getAllByRole('img');
    fireEvent.click(images[0]);

    const prevButton = screen.getByLabelText(/Previous image/i);
    fireEvent.click(prevButton);

    expect(screen.getByText(/3 \/ 3/i)).toBeInTheDocument();
  });

  it('wraps around to first image when clicking next on last image', () => {
    renderWithTheme(<MediaGallery images={mockImages} />);
    const images = screen.getAllByRole('img');
    fireEvent.click(images[2]);

    const nextButton = screen.getByLabelText(/Next image/i);
    fireEvent.click(nextButton);

    expect(screen.getByText(/1 \/ 3/i)).toBeInTheDocument();
  });
});
