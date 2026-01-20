import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../themes/light';
import { GlassCard } from './GlassCard';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('GlassCard', () => {
  it('renders children correctly', () => {
    const { container } = renderWithTheme(<GlassCard>Test Content</GlassCard>);
    expect(container.textContent).toBe('Test Content');
  });

  it('renders as a div element', () => {
    const { container } = renderWithTheme(<GlassCard>Test</GlassCard>);
    const glassCard = container.firstChild as HTMLElement;
    expect(glassCard.tagName).toBe('DIV');
  });
});
