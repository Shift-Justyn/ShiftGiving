import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../themes/light';
import { MetricsDashboard } from './MetricsDashboard';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={lightTheme}>{component}</ThemeProvider>);
};

describe('MetricsDashboard', () => {
  it('renders all metric cards', () => {
    renderWithTheme(
      <MetricsDashboard
        totalDonated={45750}
        campaignsSupported={12}
        familiesHelped={458}
        organizations={8}
      />
    );

    expect(screen.getByText('Total Donated')).toBeInTheDocument();
    expect(screen.getByText('Campaigns Supported')).toBeInTheDocument();
    expect(screen.getByText('Families Helped')).toBeInTheDocument();
    expect(screen.getByText('Organizations')).toBeInTheDocument();
  });

  it('formats currency correctly', () => {
    renderWithTheme(
      <MetricsDashboard
        totalDonated={45750}
        campaignsSupported={12}
        familiesHelped={458}
        organizations={8}
      />
    );

    expect(screen.getByText('$45,750')).toBeInTheDocument();
  });

  it('formats numbers correctly', () => {
    renderWithTheme(
      <MetricsDashboard
        totalDonated={45750}
        campaignsSupported={12}
        familiesHelped={458}
        organizations={8}
      />
    );

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('458')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('displays trend indicator', () => {
    renderWithTheme(
      <MetricsDashboard
        totalDonated={45750}
        campaignsSupported={12}
        familiesHelped={458}
        organizations={8}
      />
    );

    expect(screen.getByText('+12% this month')).toBeInTheDocument();
  });
});
