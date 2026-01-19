import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '../../src/store/authStore';
import * as authApi from '../../src/api/auth';
import * as storage from '../../src/lib/storage';

jest.mock('../../src/api/auth');
jest.mock('../../src/lib/storage');

describe('authStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  describe('login', () => {
    it('updates user after successful login', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@test.com', firstName: 'Test', lastName: 'User', userType: 'donor', avatarUrl: null },
        token: 'token-123',
        refreshToken: 'refresh-123',
      };
      (authApi.login as jest.Mock).mockResolvedValue(mockResponse);
      const { result } = renderHook(() => useAuthStore());
      await act(async () => {
        await result.current.login({ email: 'test@test.com', password: 'pass' });
      });
      expect(result.current.user).toEqual(mockResponse.user);
    });

    it('stores token in secure storage', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@test.com', firstName: 'Test', lastName: 'User', userType: 'donor', avatarUrl: null },
        token: 'token-123',
        refreshToken: 'refresh-123',
      };
      (authApi.login as jest.Mock).mockResolvedValue(mockResponse);
      const { result } = renderHook(() => useAuthStore());
      await act(async () => {
        await result.current.login({ email: 'test@test.com', password: 'pass' });
      });
      expect(storage.setSecureItem).toHaveBeenCalledWith('auth_token', 'token-123');
    });

    it('sets isAuthenticated to true', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@test.com', firstName: 'Test', lastName: 'User', userType: 'donor', avatarUrl: null },
        token: 'token-123',
        refreshToken: 'refresh-123',
      };
      (authApi.login as jest.Mock).mockResolvedValue(mockResponse);
      const { result } = renderHook(() => useAuthStore());
      await act(async () => {
        await result.current.login({ email: 'test@test.com', password: 'pass' });
      });
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('logout', () => {
    it('removes token from secure storage', async () => {
      const { result } = renderHook(() => useAuthStore());
      await act(async () => {
        await result.current.logout();
      });
      expect(storage.removeSecureItem).toHaveBeenCalledWith('auth_token');
    });

    it('clears user state', async () => {
      const { result } = renderHook(() => useAuthStore());
      await act(async () => {
        await result.current.logout();
      });
      expect(result.current.user).toBeNull();
    });

    it('sets isAuthenticated to false', async () => {
      const { result } = renderHook(() => useAuthStore());
      await act(async () => {
        await result.current.logout();
      });
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('loadToken', () => {
    it('loads token from secure storage', async () => {
      (storage.getSecureItem as jest.Mock).mockResolvedValue('stored-token');
      const { result } = renderHook(() => useAuthStore());
      await act(async () => {
        await result.current.loadToken();
      });
      expect(result.current.token).toBe('stored-token');
    });

    it('sets isAuthenticated when token exists', async () => {
      (storage.getSecureItem as jest.Mock).mockResolvedValue('stored-token');
      const { result } = renderHook(() => useAuthStore());
      await act(async () => {
        await result.current.loadToken();
      });
      expect(result.current.isAuthenticated).toBe(true);
    });
  });
});
