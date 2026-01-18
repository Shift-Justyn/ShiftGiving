# AuthContext Usage

## Setup

Wrap your application with the AuthProvider:

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

## Using the useAuth Hook

```tsx
import { useAuth } from './context/AuthContext';

function LoginComponent() {
  const { login, isAuthenticated, token, userId } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

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

## Register a New User

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

## Logout

```tsx
function LogoutComponent() {
  const { logout } = useAuth();

  return <button onClick={logout}>Logout</button>;
}
```

## Token Persistence

The authentication token and userId are automatically stored in localStorage and restored on page reload.
