import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { ImageUploader } from './ImageUploader';
import { mockTheme } from '../../test-utils/theme';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

describe('ImageUploader', () => {
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload zone', () => {
    renderWithTheme(<ImageUploader onUpload={mockOnUpload} isUploading={false} />);
    expect(screen.getByText(/drag and drop an image, or click to browse/i)).toBeInTheDocument();
  });

  it('displays file size limit info', () => {
    renderWithTheme(<ImageUploader onUpload={mockOnUpload} isUploading={false} />);
    expect(screen.getByText(/JPG, PNG, GIF, or WebP \(max 10MB\)/i)).toBeInTheDocument();
  });

  it('calls onUpload when valid file is selected', async () => {
    renderWithTheme(<ImageUploader onUpload={mockOnUpload} isUploading={false} />);

    const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(file);
    });
  });

  it('shows error for invalid file type', async () => {
    renderWithTheme(<ImageUploader onUpload={mockOnUpload} isUploading={false} />);

    const file = new File(['document'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument();
    });
  });

  it('shows error for file size exceeding limit', async () => {
    renderWithTheme(<ImageUploader onUpload={mockOnUpload} isUploading={false} />);

    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    });
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [largeFile],
      writable: false,
    });

    fireEvent.change(input);

    await waitFor(() => {
      expect(screen.getByText(/File size exceeds 10MB limit/i)).toBeInTheDocument();
    });
  });

  it('displays progress when uploading', () => {
    renderWithTheme(<ImageUploader onUpload={mockOnUpload} isUploading={true} />);
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    const file = new File(['image'], 'test.jpg', { type: 'image/jpeg' });

    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);
  });
});
