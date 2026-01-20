# React Context Providers

The application uses three main context providers for global state management.

## Provider Hierarchy

```tsx
<FeatureFlagsProvider>
  <ThemeProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
</FeatureFlagsProvider>
```

---

## AuthContext

Manages user authentication state with JWT tokens.

### Setup

```tsx
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <YourAppComponents />
    </AuthProvider>
  );
}
```

### Using the useAuth Hook

```tsx
import { useAuth } from './context/AuthContext';

function LoginComponent() {
  const { login, isAuthenticated, token, userId, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <p>Logged in as {userId}</p>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Register a New User

```tsx
function RegisterComponent() {
  const { register } = useAuth();

  const handleRegister = async () => {
    try {
      await register('user@example.com', 'password123', 'John', 'Doe');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return <button onClick={handleRegister}>Register</button>;
}
```

### Logout

```tsx
function LogoutComponent() {
  const { logout } = useAuth();

  return <button onClick={logout}>Logout</button>;
}
```

### Token Persistence

The authentication token and userId are automatically stored in localStorage and restored on page reload.

---

## ThemeContext

Manages light/dark theme state with system preference detection.

### Setup

```tsx
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <YourAppComponents />
    </ThemeProvider>
  );
}
```

### Using the useTheme Hook

```tsx
import { useTheme } from './context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return <button onClick={toggleTheme}>{isDark ? 'Switch to Light' : 'Switch to Dark'}</button>;
}
```

### Features

- Detects system color scheme preference
- Persists user preference to localStorage
- Provides `theme` object for styled-components
- `isDark` boolean for conditional styling

---

## FeatureFlagsContext

Manages feature toggles for non-production environments.

### Setup

```tsx
import { FeatureFlagsProvider } from './context/FeatureFlagsContext';

function App() {
  return (
    <FeatureFlagsProvider>
      <YourAppComponents />
    </FeatureFlagsProvider>
  );
}
```

### Available Flags

| Flag                  | Default | Description                           |
| --------------------- | ------- | ------------------------------------- |
| `RECURRING_DONATIONS` | `false` | Enable recurring donation option      |
| `SOCIAL_SHARING`      | `true`  | Enable social share buttons           |
| `EMAIL_NOTIFICATIONS` | `true`  | Enable email notification preferences |

### Using the useFeatureFlags Hook

```tsx
import { useFeatureFlags } from './context/FeatureFlagsContext';

function MyComponent() {
  const { flags, isEnabled, toggleFlag, resetFlags, canToggle } = useFeatureFlags();

  // Check if a flag is enabled
  if (isEnabled('RECURRING_DONATIONS')) {
    // Show recurring donation UI
  }

  // Toggle a flag (only in non-production)
  if (canToggle) {
    toggleFlag('SOCIAL_SHARING');
  }

  // Reset all flags to defaults
  resetFlags();

  return <div>...</div>;
}
```

### Declarative Usage with FeatureFlag Component

```tsx
import { FeatureFlag } from '../components/FeatureFlag';

function DonationConfirmation() {
  return (
    <div>
      <h1>Thank you!</h1>

      <FeatureFlag name="SOCIAL_SHARING">
        <SocialShareButtons />
      </FeatureFlag>

      <FeatureFlag name="EMAIL_NOTIFICATIONS" fallback={<p>Coming soon</p>}>
        <EmailPreferences />
      </FeatureFlag>
    </div>
  );
}
```

### Dev Tools

In development/QA environments, a floating "FF" button appears in the bottom-right corner. Click it to:

- View all feature flags
- Toggle flags on/off
- Reset to default values

Flag overrides persist in localStorage.

### Production Behavior

In production (`import.meta.env.PROD === true`):

- Flags use default values only
- `toggleFlag()` is disabled
- Dev tools panel is hidden
- `canToggle` returns `false`

---

## Adding New Feature Flags

1. Add the flag name to the type in `config/featureFlags.ts`:

```typescript
export type FeatureFlagName =
  | 'RECURRING_DONATIONS'
  | 'SOCIAL_SHARING'
  | 'EMAIL_NOTIFICATIONS'
  | 'YOUR_NEW_FLAG'; // Add here
```

2. Set the default value:

```typescript
export const DEFAULT_FLAGS: Record<FeatureFlagName, boolean> = {
  RECURRING_DONATIONS: false,
  SOCIAL_SHARING: true,
  EMAIL_NOTIFICATIONS: true,
  YOUR_NEW_FLAG: false, // Add here
};
```

3. Add a description:

```typescript
export const FLAG_DESCRIPTIONS: Record<FeatureFlagName, string> = {
  RECURRING_DONATIONS: 'Enable recurring donation option',
  SOCIAL_SHARING: 'Enable social share buttons on confirmation',
  EMAIL_NOTIFICATIONS: 'Enable email notification preferences',
  YOUR_NEW_FLAG: 'Description of your new flag', // Add here
};
```

4. Use the flag in your component:

```tsx
<FeatureFlag name="YOUR_NEW_FLAG">
  <NewFeatureComponent />
</FeatureFlag>
```
