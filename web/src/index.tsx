import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FeatureFlagsProvider } from './context/FeatureFlagsContext';
import { FeatureFlagDevTools } from './components/FeatureFlagDevTools';
import { GlobalStyles } from './GlobalStyles';
import { router } from './router/index';
import './i18n';

const enableMocks = async () => {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
    console.log('[MSW] Mock service worker started');
  }
};

enableMocks().then(() => {
  const root = createRoot(document.getElementById('root')!);
  root.render(
    <StrictMode>
      <FeatureFlagsProvider>
        <ThemeProvider>
          <GlobalStyles />
          <AuthProvider>
            <RouterProvider router={router} />
            <FeatureFlagDevTools />
          </AuthProvider>
        </ThemeProvider>
      </FeatureFlagsProvider>
    </StrictMode>
  );
});
