import { createBrowserRouter, Outlet, useLocation } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { CampaignDetailPage } from '../pages/CampaignDetailPage';
import { CreateCampaignPage } from '../pages/CreateCampaignPage';
import { AllCampaignsPage } from '../pages/AllCampaignsPage';
import { DonationPage } from '../pages/DonationPage';
import { PaymentPage } from '../pages/PaymentPage';
import { DonationConfirmationPage } from '../pages/DonationConfirmationPage';
import { HistoryPage } from '../pages/HistoryPage';
import { MessagesPage } from '../pages/MessagesPage';
import { ImpactPage } from '../pages/ImpactPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { CartIcon } from '../components/cart/CartIcon';

const RootLayout = () => {
  const location = useLocation();
  const hideCartOnPaths = ['/login', '/register'];
  const showCart = !hideCartOnPaths.includes(location.pathname);

  return (
    <>
      <Outlet />
      {showCart && <CartIcon />}
    </>
  );
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/campaigns',
        element: (
          <ProtectedRoute>
            <AllCampaignsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/campaigns/create',
        element: (
          <ProtectedRoute>
            <CreateCampaignPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/campaigns/:id',
        element: (
          <ProtectedRoute>
            <CampaignDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/campaigns/:id/donate',
        element: (
          <ProtectedRoute>
            <DonationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/campaigns/:id/donate/payment',
        element: (
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/donations/:id/confirmation',
        element: (
          <ProtectedRoute>
            <DonationConfirmationPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/history',
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/messages',
        element: (
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/impact',
        element: (
          <ProtectedRoute>
            <ImpactPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <ErrorBoundary />,
      },
    ],
  },
]);
