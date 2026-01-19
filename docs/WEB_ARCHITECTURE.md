# Web Architecture - ShiftGiving React Dashboard

This document defines the architecture and implementation plan for the React web application (organization dashboard).

## Current State

### What's Implemented
- React 19 with TypeScript
- **Vite** - Build tool and dev server (migrated from Webpack)
- Jest + Playwright testing setup (73 tests passing)
- react-router-dom v7 routing
- styled-components theming (light/dark modes)
- react-i18next internationalization
- **Feature Flags System** - Toggle features in non-production
- AuthContext - JWT authentication with localStorage persistence
- ThemeContext - Dark/light mode with system preference detection
- FeatureFlagsContext - Runtime feature toggles for dev/QA
- API client with typed endpoints
- Pages: Login, Register, Home, Campaign Detail, Donation, Payment, Confirmation

### What's Remaining
- Organization dashboard screens from Figma
- Analytics charts
- Message/story management

---

## Target Architecture

### Project Structure

```
web/
├── src/
│   ├── index.js                     # App entry point
│   ├── App.tsx                      # Root component
│   │
│   ├── config/
│   │   ├── api.ts                   # API configuration
│   │   ├── routes.ts                # Route definitions
│   │   └── constants.ts             # App constants
│   │
│   ├── api/
│   │   ├── client.ts                # Fetch/axios client
│   │   ├── auth.ts                  # Auth endpoints
│   │   ├── campaigns.ts             # Campaign endpoints
│   │   ├── donations.ts             # Donation endpoints
│   │   ├── organizations.ts         # Organization endpoints
│   │   └── messages.ts              # Message endpoints
│   │
│   ├── hooks/
│   │   ├── useAuth.ts               # Auth hook
│   │   ├── useCampaigns.ts          # Campaigns data hook
│   │   ├── useDonations.ts          # Donations data hook
│   │   └── useAnalytics.ts          # Analytics data hook
│   │
│   ├── context/
│   │   ├── AuthContext.tsx          # Auth provider (JWT, localStorage)
│   │   ├── ThemeContext.tsx         # Theme provider (light/dark)
│   │   └── FeatureFlagsContext.tsx  # Feature flags for dev/QA
│   │
│   ├── types/
│   │   ├── user.ts                  # User types
│   │   ├── campaign.ts              # Campaign types
│   │   ├── donation.ts              # Donation types
│   │   ├── organization.ts          # Organization types
│   │   └── api.ts                   # API response types
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── MainLayout.tsx
│   │   │   └── AuthLayout.tsx
│   │   │
│   │   ├── charts/
│   │   │   ├── LineChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   └── BarChart.tsx
│   │   │
│   │   ├── campaigns/
│   │   │   ├── CampaignCard.tsx
│   │   │   ├── CampaignForm.tsx
│   │   │   └── CampaignTable.tsx
│   │   │
│   │   ├── donations/
│   │   │   ├── DonationTable.tsx
│   │   │   └── DonationRow.tsx
│   │   │
│   │   └── dashboard/
│   │       ├── MetricCard.tsx
│   │       ├── RecentDonations.tsx
│   │       └── ProgramAllocation.tsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   │
│   │   ├── campaigns/
│   │   │   ├── CampaignsPage.tsx
│   │   │   ├── CampaignDetailPage.tsx
│   │   │   └── CampaignEditPage.tsx
│   │   │
│   │   ├── donations/
│   │   │   └── DonationsPage.tsx
│   │   │
│   │   ├── messages/
│   │   │   ├── MessagesPage.tsx
│   │   │   └── MessageEditPage.tsx
│   │   │
│   │   └── settings/
│   │       └── SettingsPage.tsx
│   │
│   ├── styles/
│   │   ├── theme.ts                 # styled-components theme
│   │   ├── globalStyles.ts          # Global styles
│   │   └── mixins.ts                # Reusable style mixins
│   │
│   └── utils/
│       ├── formatters.ts            # Data formatters
│       ├── validators.ts            # Form validation
│       └── storage.ts               # Local storage helpers
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── e2e/
│   └── *.spec.ts                    # Playwright tests
│
└── __tests__/
    └── *.test.ts                    # Jest tests
```

---

## Dependencies

### Add to package.json

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "styled-components": "^6.1.0",
    "recharts": "^2.10.0",
    "@tanstack/react-query": "^5.17.0",
    "axios": "^1.6.0",
    "date-fns": "^3.2.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "lucide-react": "^0.306.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/styled-components": "^5.1.0",
    "typescript": "^5.3.0",
    "@babel/core": "^7.26.0",
    "@babel/preset-env": "^7.26.0",
    "@babel/preset-react": "^7.26.3",
    "@babel/preset-typescript": "^7.23.0",
    "@playwright/test": "^1.52.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@types/jest": "^29.5.14",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^30.0.0-beta.3",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "@typescript-eslint/eslint-plugin": "^6.18.0",
    "@typescript-eslint/parser": "^6.18.0",
    "prettier": "^3.2.0"
  }
}
```

---

## Routing

Using React Router v7 for navigation.

### Route Configuration

```tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'campaigns', element: <CampaignsPage /> },
      { path: 'campaigns/new', element: <CampaignEditPage /> },
      { path: 'campaigns/:id', element: <CampaignDetailPage /> },
      { path: 'campaigns/:id/edit', element: <CampaignEditPage /> },
      { path: 'donations', element: <DonationsPage /> },
      { path: 'messages', element: <MessagesPage /> },
      { path: 'messages/new', element: <MessageEditPage /> },
      { path: 'messages/:id/edit', element: <MessageEditPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);
```

---

## State Management

Using React Query for server state and Context for client state.

### Auth Context

```tsx
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.get('/users/me');
        setUser(response.data.data);
      } catch {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    const { user, token } = response.data.data;
    localStorage.setItem('token', token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

### React Query Hooks

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useCampaigns(filters?: CampaignFilters) {
  return useQuery({
    queryKey: ['campaigns', filters],
    queryFn: () => api.getCampaigns(filters),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: ['campaigns', id],
    queryFn: () => api.getCampaign(id),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCampaignDto) => api.createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: () => api.getDashboardMetrics(),
    refetchInterval: 60000, // Refresh every minute
  });
}
```

---

## Styled Components Theme

```tsx
export const theme = {
  colors: {
    primary: '#00A0C4',
    primaryHover: '#0080A0',
    secondary: '#F97316',
    error: '#DC2626',
    success: '#16A34A',
    warning: '#F59E0B',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    border: '#E5E5E5',
    text: {
      primary: '#000000',
      secondary: '#878787',
      inverse: '#FFFFFF',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
};

export type Theme = typeof theme;
```

---

## Component Examples

### Sidebar Component

```tsx
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Home, Folder, Mail, MessageSquare, Settings } from 'lucide-react';

const SidebarContainer = styled.aside`
  width: 4rem;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const NavItem = styled(NavLink)`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
  }
`;

export function Sidebar() {
  return (
    <SidebarContainer>
      <NavItem to="/" end><Home size={20} /></NavItem>
      <NavItem to="/campaigns"><Folder size={20} /></NavItem>
      <NavItem to="/donations"><Mail size={20} /></NavItem>
      <NavItem to="/messages"><MessageSquare size={20} /></NavItem>
      <NavItem to="/settings"><Settings size={20} /></NavItem>
    </SidebarContainer>
  );
}
```

### Metric Card Component

```tsx
import styled from 'styled-components';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Value = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Label = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Change = styled.span<{ positive: boolean }>`
  font-size: 0.75rem;
  color: ${({ positive, theme }) =>
    positive ? theme.colors.success : theme.colors.error};
`;

interface MetricCardProps {
  label: string;
  value: string;
  change?: number;
}

export function MetricCard({ label, value, change }: MetricCardProps) {
  return (
    <Card>
      <Label>{label}</Label>
      <Value>{value}</Value>
      {change !== undefined && (
        <Change positive={change >= 0}>
          {change >= 0 ? '+' : ''}{change}% this week
        </Change>
      )}
    </Card>
  );
}
```

### Donations Table Component

```tsx
import styled from 'styled-components';
import { format } from 'date-fns';
import { useDonations } from '../hooks/useDonations';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.75rem;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ViewButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: 0.875rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export function DonationsTable() {
  const { data, isLoading } = useDonations();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Table>
      <thead>
        <tr>
          <Th>First Name</Th>
          <Th>Last Name</Th>
          <Th>Date</Th>
          <Th>Email</Th>
          <Th>Amount</Th>
          <Th>Action</Th>
        </tr>
      </thead>
      <tbody>
        {data?.map((donation) => (
          <tr key={donation.id}>
            <Td>{donation.donor.firstName}</Td>
            <Td>{donation.donor.lastName}</Td>
            <Td>{format(new Date(donation.createdAt), 'MMM d, yyyy')}</Td>
            <Td>{donation.donor.email}</Td>
            <Td>${donation.amount.toFixed(2)}</Td>
            <Td><ViewButton>View</ViewButton></Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
```

---

## Page Implementation Priority

### Phase 1: Core Dashboard
1. Login Page
2. Main Layout (Sidebar + Header)
3. Dashboard Page with Metrics
4. Basic Donations Table

### Phase 2: Campaign Management
1. Campaigns List Page
2. Campaign Detail Page
3. Campaign Create/Edit Form

### Phase 3: Additional Features
1. Messages/Stories Page
2. Message Create/Edit
3. Settings Page
4. Analytics Charts

---

## TypeScript Types

```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: 'individual' | 'organization_admin';
  organizationId?: string;
  avatarUrl?: string;
}

// types/campaign.ts
export interface Campaign {
  id: string;
  title: string;
  description?: string;
  shortDescription?: string;
  goalAmount: number;
  raisedAmount: number;
  status: 'draft' | 'active' | 'closing_soon' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  featuredImageUrl?: string;
  organization: OrganizationSummary;
}

// types/donation.ts
export interface Donation {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  donor: {
    firstName: string;
    lastName: string;
    email: string;
  };
  campaign: {
    id: string;
    title: string;
  };
}

// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}
```

---

## Testing Strategy

### Unit Tests (Jest)
- Hooks
- Utility functions
- Components (isolated)

### Integration Tests (React Testing Library)
- Page components
- Forms
- Data flows

### E2E Tests (Playwright)
- Login flow
- Campaign CRUD
- Donation viewing

### Test Commands
```bash
# Unit tests
npm test

# E2E tests
npm run e2e

# Coverage
npm test -- --coverage
```

---

## Build Configuration

### Vite Configuration (vite.config.ts)

The project uses Vite for fast development and optimized production builds.

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### Environment Variables

Vite uses `import.meta.env` instead of `process.env`:

```typescript
// Check production mode
if (import.meta.env.PROD) {
  // Production code
}

// Custom env vars (prefix with VITE_)
const apiUrl = import.meta.env.VITE_API_URL;
```

### Feature Flags

Feature flags are defined in `src/config/featureFlags.ts`:

```typescript
export type FeatureFlagName =
  | 'RECURRING_DONATIONS'
  | 'SOCIAL_SHARING'
  | 'EMAIL_NOTIFICATIONS';

export const DEFAULT_FLAGS: Record<FeatureFlagName, boolean> = {
  RECURRING_DONATIONS: false,
  SOCIAL_SHARING: true,
  EMAIL_NOTIFICATIONS: true,
};
```

Usage:
```tsx
// Declarative
<FeatureFlag name="SOCIAL_SHARING">
  <SocialButtons />
</FeatureFlag>

// Imperative
const { isEnabled } = useFeatureFlags();
if (isEnabled('RECURRING_DONATIONS')) { ... }
```

---

## ESLint + Prettier Configuration

### .eslintrc.js

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: { version: 'detect' },
  },
};
```

### .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```
