# GivingApp - Web App

React web application for the GivingApp donation platform.

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **styled-components** - CSS-in-JS styling
- **react-router-dom** - Client-side routing
- **react-i18next** - Internationalization
- **Jest** - Unit testing
- **Playwright** - E2E testing

## Setting Up Your Local Environment

```bash
nvm use          # Use Node version from .nvmrc
npm install      # Install dependencies
```

## Running the Application Locally

1. Start the API backend locally (see `/api/README.md`)
2. Start the local database (`./scripts/start_local_db.sh`)
3. Run the web app:

```bash
npm start        # or npm run dev
```

4. Open http://localhost:8080/ in a browser

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Vite dev server on port 8080 |
| `npm run dev` | Alias for `npm start` |
| `npm run build` | Create production build in `/dist` |
| `npm run preview` | Preview production build locally |
| `npm test` | Run Jest unit tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run e2e` | Run Playwright E2E tests |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |

## Running Tests

### Unit Tests (Jest)

```bash
npm test                    # Run all tests
npm run test:coverage       # Run with coverage report
```

### E2E Tests (Playwright)

```bash
npm run e2e                 # Run all E2E tests
npx playwright test --ui    # Run with UI mode
```

Or use the test script:

```bash
./run_tests.sh
```

## Project Structure

```
web/
├── src/
│   ├── api/                # API client and endpoint functions
│   ├── components/         # Reusable React components
│   │   ├── campaigns/      # Campaign-related components
│   │   ├── forms/          # Form components
│   │   └── organizations/  # Organization components
│   ├── config/             # Configuration files
│   │   └── featureFlags.ts # Feature flag definitions
│   ├── context/            # React context providers
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── FeatureFlagsContext.tsx
│   ├── i18n/               # Internationalization
│   ├── pages/              # Page components
│   ├── router/             # Route definitions
│   └── themes/             # Theme definitions (light/dark)
├── e2eTests/               # Playwright E2E tests
├── index.html              # Vite entry point
├── vite.config.ts          # Vite configuration
├── jest.config.ts          # Jest configuration
└── tsconfig.json           # TypeScript configuration
```

## Feature Flags

The app includes a feature flags system for toggling features in non-production environments.

### Available Flags

| Flag | Default | Description |
|------|---------|-------------|
| `RECURRING_DONATIONS` | `false` | Enable recurring donation option |
| `SOCIAL_SHARING` | `true` | Enable social share buttons on confirmation |
| `EMAIL_NOTIFICATIONS` | `true` | Enable email notification preferences |

### Usage

```tsx
import { FeatureFlag } from './components/FeatureFlag';
import { useFeatureFlags } from './context/FeatureFlagsContext';

// Declarative usage
<FeatureFlag name="SOCIAL_SHARING">
  <SocialShareButtons />
</FeatureFlag>

// Hook usage
const { isEnabled, toggleFlag } = useFeatureFlags();
if (isEnabled('RECURRING_DONATIONS')) {
  // Show recurring donation UI
}
```

### Dev Tools

In development mode, a floating "FF" button appears in the bottom-right corner allowing you to toggle feature flags. Overrides persist in localStorage.

## Theming

The app supports light and dark modes via `ThemeContext`. Theme preference is persisted to localStorage and respects system preferences.

```tsx
import { useTheme } from './context/ThemeContext';

const { theme, toggleTheme, isDark } = useTheme();
```

## Internationalization

The app uses react-i18next for translations. Currently supports:
- English (US) - `en-US`

Language preference is persisted to localStorage.

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<h1>{t('home.welcome')}</h1>
```

## Environment Variables

Vite uses `import.meta.env` for environment variables. Prefix custom variables with `VITE_`.

```typescript
// Access in code
const apiUrl = import.meta.env.VITE_API_URL;

// Check environment
if (import.meta.env.PROD) {
  // Production only code
}
```
