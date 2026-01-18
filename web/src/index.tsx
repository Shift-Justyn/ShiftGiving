import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FeatureFlagsProvider } from './context/FeatureFlagsContext';
import { FeatureFlagDevTools } from './components/FeatureFlagDevTools';
import { router } from './router';
import './i18n';

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <FeatureFlagsProvider>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <FeatureFlagDevTools />
        </AuthProvider>
      </ThemeProvider>
    </FeatureFlagsProvider>
  </StrictMode>
);
