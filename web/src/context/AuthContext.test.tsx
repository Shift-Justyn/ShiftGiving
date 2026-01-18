import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as authApi from '../api/auth';

jest.mock('../api/auth');

const mockAuthApi = authApi as jest.Mocked<typeof authApi>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe('AuthContext initial state', () => {
  test('isAuthenticated is false initially', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('token is null initially', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.token).toBe(null);
  });

  test('userId is null initially', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.userId).toBe(null);
  });
});

describe('AuthContext login', () => {
  test('login sets token', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.token).toBe('test-token');
  });

  test('login sets userId', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.userId).toBe('test-user-id');
  });

  test('login sets isAuthenticated to true', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  test('login calls API with correct credentials', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(mockAuthApi.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  test('login stores token in localStorage', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(localStorage.getItem('auth_token')).toBe('test-token');
  });

  test('login stores userId in localStorage', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(localStorage.getItem('user_id')).toBe('test-user-id');
  });
});

describe('AuthContext register', () => {
  test('register calls API with correct data', async () => {
    mockAuthApi.register.mockResolvedValue();

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register('test@example.com', 'password', 'John', 'Doe');
    });

    expect(mockAuthApi.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  test('register does not set token', async () => {
    mockAuthApi.register.mockResolvedValue();

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register('test@example.com', 'password', 'John', 'Doe');
    });

    expect(result.current.token).toBe(null);
  });
});

describe('AuthContext logout', () => {
  test('logout clears token', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.token).toBe(null);
  });

  test('logout clears userId', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.userId).toBe(null);
  });

  test('logout sets isAuthenticated to false', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  test('logout removes token from localStorage', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem('auth_token')).toBe(null);
  });

  test('logout removes userId from localStorage', async () => {
    mockAuthApi.login.mockResolvedValue({
      token: 'test-token',
      refreshToken: 'test-refresh',
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        userType: 'donor',
        avatarUrl: null,
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem('user_id')).toBe(null);
  });
});

describe('AuthContext persistence', () => {
  test('restores token from localStorage on mount', async () => {
    localStorage.setItem('auth_token', 'stored-token');
    localStorage.setItem('user_id', 'stored-user-id');

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.token).toBe('stored-token');
    });
  });

  test('restores userId from localStorage on mount', async () => {
    localStorage.setItem('auth_token', 'stored-token');
    localStorage.setItem('user_id', 'stored-user-id');

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.userId).toBe('stored-user-id');
    });
  });

  test('sets isAuthenticated to true when restored', async () => {
    localStorage.setItem('auth_token', 'stored-token');
    localStorage.setItem('user_id', 'stored-user-id');

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});

describe('AuthContext hook error', () => {
  test('useAuth throws error when used outside provider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});
