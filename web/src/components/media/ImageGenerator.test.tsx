import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { ImageGenerator } from './ImageGenerator';
import { mockTheme } from '../../test-utils/theme';
import * as aiApi from '../../api/ai';

jest.mock('../../api/ai', () => ({
  ...jest.requireActual('../../api/ai'),
  generateAIImage: jest.fn(),
}));

const mockGenerateAIImage = aiApi.generateAIImage as jest.MockedFunction<
  typeof aiApi.generateAIImage
>;

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={mockTheme}>{component}</ThemeProvider>);
};

describe('ImageGenerator', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateAIImage.mockResolvedValue({
      url: 'https://example.com/generated.jpg',
      prompt: 'Test prompt',
      revisedPrompt: 'Test prompt enhanced',
    });
  });

  it('renders prompt input', () => {
    renderWithTheme(<ImageGenerator onSelect={mockOnSelect} />);
    expect(screen.getByLabelText(/Describe the image you want to create/i)).toBeInTheDocument();
  });

  it('renders photography style dropdown', () => {
    renderWithTheme(<ImageGenerator onSelect={mockOnSelect} />);
    expect(screen.getByLabelText(/Photography Style/i)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Documentary/i })).toBeInTheDocument();
  });

  it('renders category dropdown', () => {
    renderWithTheme(<ImageGenerator onSelect={mockOnSelect} />);
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
  });

  it('disables generate button when prompt is empty', () => {
    renderWithTheme(<ImageGenerator onSelect={mockOnSelect} />);
    const button = screen.getByRole('button', { name: /Generate Photorealistic Image/i });
    expect(button).toBeDisabled();
  });

  it('enables generate button when prompt is entered', () => {
    renderWithTheme(<ImageGenerator onSelect={mockOnSelect} />);
    const textarea = screen.getByLabelText(/Describe the image you want to create/i);
    const button = screen.getByRole('button', { name: /Generate Photorealistic Image/i });

    fireEvent.change(textarea, { target: { value: 'Test prompt' } });

    expect(button).not.toBeDisabled();
  });

  it('calls generateAIImage API when button clicked', async () => {
    renderWithTheme(<ImageGenerator onSelect={mockOnSelect} />);
    const textarea = screen.getByLabelText(/Describe the image you want to create/i);
    const button = screen.getByRole('button', { name: /Generate Photorealistic Image/i });

    fireEvent.change(textarea, { target: { value: 'Children playing' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockGenerateAIImage).toHaveBeenCalledWith({
        prompt: 'Children playing',
        style: 'documentary',
        category: undefined,
      });
    });
  });

  it('shows loading state while generating', async () => {
    mockGenerateAIImage.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                url: 'https://example.com/generated.jpg',
                prompt: 'Test prompt',
              }),
            100
          )
        )
    );

    renderWithTheme(<ImageGenerator onSelect={mockOnSelect} />);

    const textarea = screen.getByLabelText(/Describe the image you want to create/i);
    const button = screen.getByRole('button', { name: /Generate Photorealistic Image/i });

    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    fireEvent.click(button);

    expect(screen.getByRole('button', { name: /Generating with AI.../i })).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGenerateAIImage).toHaveBeenCalled();
    });
  });

  it('displays generated image preview', async () => {
    renderWithTheme(<ImageGenerator onSelect={mockOnSelect} />);
    const textarea = screen.getByLabelText(/Describe the image you want to create/i);
    const button = screen.getByRole('button', { name: /Generate Photorealistic Image/i });

    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Generated Image/i)).toBeInTheDocument();
    });
  });

  it('shows prompt suggestions when category is selected', () => {
    renderWithTheme(<ImageGenerator onSelect={mockOnSelect} />);
    const categorySelect = screen.getByLabelText(/Category/i);

    fireEvent.change(categorySelect, { target: { value: 'Education' } });

    expect(screen.getByText(/Suggested prompts for Education/i)).toBeInTheDocument();
  });

  it('populates prompt when suggestion is clicked', () => {
    renderWithTheme(<ImageGenerator onSelect={mockOnSelect} />);
    const categorySelect = screen.getByLabelText(/Category/i);

    fireEvent.change(categorySelect, { target: { value: 'Education' } });

    const suggestion = screen.getByText(/Students backs facing a whiteboard/i);
    fireEvent.click(suggestion);

    const textarea = screen.getByLabelText(/Describe the image you want to create/i);
    expect(textarea).toHaveValue('Students backs facing a whiteboard in a small classroom');
  });
});
