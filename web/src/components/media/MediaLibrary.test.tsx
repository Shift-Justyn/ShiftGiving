import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { MediaLibrary } from './MediaLibrary';
import { mockTheme } from '../../test-utils/theme';
import * as mediaApi from '../../api/media';

jest.mock('../../api/media');

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

describe('MediaLibrary', () => {
  const mockOnClose = jest.fn();
  const mockOnSelect = jest.fn();

  const mockMediaAssets = [
    {
      id: 'media-1',
      name: 'Test Image 1',
      url: 'https://example.com/image1.jpg',
      type: 'image' as const,
      size: '2.4 MB',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'media-2',
      name: 'Test Image 2',
      url: 'https://example.com/image2.jpg',
      type: 'image' as const,
      size: '1.8 MB',
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (mediaApi.getMediaAssets as jest.Mock).mockResolvedValue(mockMediaAssets);
  });

  it('does not render when closed', () => {
    renderWithTheme(<MediaLibrary isOpen={false} onClose={mockOnClose} onSelect={mockOnSelect} />);
    expect(screen.queryByText(/Media Library/i)).not.toBeInTheDocument();
  });

  it('renders when open', async () => {
    renderWithTheme(<MediaLibrary isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />);
    expect(screen.getByText(/Media Library/i)).toBeInTheDocument();
  });

  it('displays tab options', async () => {
    renderWithTheme(<MediaLibrary isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />);
    expect(screen.getByRole('button', { name: /Browse/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate with AI/i })).toBeInTheDocument();
  });

  it('loads and displays media assets', async () => {
    renderWithTheme(<MediaLibrary isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(mediaApi.getMediaAssets).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/Test Image 1/i)).toBeInTheDocument();
    });
  });

  it('filters assets by search query', async () => {
    renderWithTheme(<MediaLibrary isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />);

    await waitFor(() => {
      expect(screen.getByText(/Test Image 1/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search by name.../i);
    fireEvent.change(searchInput, { target: { value: 'Image 1' } });

    await waitFor(() => {
      expect(screen.getByText(/Test Image 1/i)).toBeInTheDocument();
    });
  });

  it('closes when overlay is clicked', () => {
    renderWithTheme(<MediaLibrary isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />);

    const overlay = screen.getByText(/Media Library/i).closest('div')?.parentElement?.parentElement;
    if (overlay) {
      fireEvent.click(overlay);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('switches to upload tab', async () => {
    renderWithTheme(<MediaLibrary isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />);

    const uploadTab = screen.getByRole('button', { name: /Upload/i });
    fireEvent.click(uploadTab);

    await waitFor(() => {
      expect(screen.getByText(/drag and drop an image/i)).toBeInTheDocument();
    });
  });

  it('switches to generate tab', async () => {
    renderWithTheme(<MediaLibrary isOpen={true} onClose={mockOnClose} onSelect={mockOnSelect} />);

    const generateTab = screen.getByRole('button', { name: /Generate with AI/i });
    fireEvent.click(generateTab);

    await waitFor(() => {
      expect(screen.getByText(/Describe the image you want to create/i)).toBeInTheDocument();
    });
  });
});
