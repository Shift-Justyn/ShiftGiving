import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import { AITextEnhancer } from './AITextEnhancer';
import { mockTheme } from '../../test-utils/theme';
import * as aiApi from '../../api/ai';

jest.mock('../../api/ai', () => ({
  ...jest.requireActual('../../api/ai'),
  enhanceText: jest.fn(),
}));

const mockEnhanceText = aiApi.enhanceText as jest.MockedFunction<typeof aiApi.enhanceText>;

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={mockTheme}>{ui}</ThemeProvider>);
}

describe('AITextEnhancer', () => {
  const defaultProps = {
    value: 'Test description',
    onChange: jest.fn(),
    field: 'description' as const,
    label: 'Description',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockEnhanceText.mockResolvedValue({
      text: 'Enhanced description',
      originalText: 'Test description',
    });
  });

  it('renders with label and textarea', () => {
    renderWithTheme(<AITextEnhancer {...defaultProps} />);

    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('displays character count', () => {
    renderWithTheme(<AITextEnhancer {...defaultProps} value="Hello" />);

    expect(screen.getByText('5/200')).toBeInTheDocument();
  });

  it('shows AI assist buttons', () => {
    renderWithTheme(<AITextEnhancer {...defaultProps} />);

    expect(screen.getByText('Fix Grammar')).toBeInTheDocument();
    expect(screen.getByText('Improve')).toBeInTheDocument();
    expect(screen.getByText('Rewrite')).toBeInTheDocument();
    expect(screen.getByText('Tone')).toBeInTheDocument();
  });

  it('shows Expand button only for story field', () => {
    const { rerender } = renderWithTheme(<AITextEnhancer {...defaultProps} field="description" />);

    expect(screen.queryByText('Expand')).not.toBeInTheDocument();

    rerender(
      <ThemeProvider theme={mockTheme}>
        <AITextEnhancer {...defaultProps} field="story" />
      </ThemeProvider>
    );

    expect(screen.getByText('Expand')).toBeInTheDocument();
  });

  it('calls enhanceText API when action button clicked', async () => {
    renderWithTheme(<AITextEnhancer {...defaultProps} />);

    fireEvent.click(screen.getByText('Improve'));

    await waitFor(() => {
      expect(mockEnhanceText).toHaveBeenCalledWith({
        text: 'Test description',
        field: 'description',
        action: 'improve',
      });
    });
  });

  it('updates text after enhancement', async () => {
    const onChange = jest.fn();
    renderWithTheme(<AITextEnhancer {...defaultProps} onChange={onChange} />);

    fireEvent.click(screen.getByText('Improve'));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('Enhanced description');
    });
  });

  it('shows undo button after enhancement', async () => {
    const onChange = jest.fn();
    renderWithTheme(<AITextEnhancer {...defaultProps} onChange={onChange} />);

    fireEvent.click(screen.getByText('Improve'));

    await waitFor(() => {
      expect(screen.getByText('Undo changes')).toBeInTheDocument();
    });
  });

  it('reverts text when undo clicked', async () => {
    const onChange = jest.fn();
    renderWithTheme(<AITextEnhancer {...defaultProps} onChange={onChange} />);

    fireEvent.click(screen.getByText('Improve'));

    await waitFor(() => {
      expect(screen.getByText('Undo changes')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Undo changes'));

    expect(onChange).toHaveBeenLastCalledWith('Test description');
  });

  it('disables buttons when text is empty', () => {
    renderWithTheme(<AITextEnhancer {...defaultProps} value="" />);

    expect(screen.getByText('Improve').closest('button')).toBeDisabled();
  });

  it('shows error message on API failure', async () => {
    mockEnhanceText.mockRejectedValueOnce(new Error('API error'));
    renderWithTheme(<AITextEnhancer {...defaultProps} />);

    fireEvent.click(screen.getByText('Improve'));

    await waitFor(() => {
      expect(screen.getByText('Failed to enhance text. Please try again.')).toBeInTheDocument();
    });
  });

  it('calls onChange when user types', async () => {
    const onChange = jest.fn();
    renderWithTheme(<AITextEnhancer {...defaultProps} onChange={onChange} value="" />);

    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, 'New text');

    expect(onChange).toHaveBeenCalled();
  });
});
