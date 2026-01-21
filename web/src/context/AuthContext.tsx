import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from 'react';
import * as authApi from '../api/auth';
import { AuthUser } from '../api/types';
import { setTokenRefreshCallback } from '../api/client';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  userId: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_ID_KEY = 'user_id';
const USER_KEY = 'auth_user';
const TOKEN_REFRESH_INTERVAL = 4 * 60 * 1000;

const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

const getStoredUserId = (): string | null => {
  return localStorage.getItem(USER_ID_KEY);
};

const getStoredUser = (): AuthUser | null => {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as AuthUser;
  } catch {
    return null;
  }
};

const storeAuth = (token: string, refreshToken: string, user: AuthUser): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_ID_KEY, user.id);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_KEY);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback((): void => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    setToken(null);
    setRefreshToken(null);
    setUserId(null);
    setUser(null);
    clearAuth();
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    const currentRefreshToken = refreshToken || getStoredRefreshToken();
    if (!currentRefreshToken) {
      return;
    }
    try {
      const response = await authApi.refreshToken({ refreshToken: currentRefreshToken });
      setToken(response.token);
      setRefreshToken(response.refreshToken);
      const currentUser = user || getStoredUser();
      if (currentUser) {
        storeAuth(response.token, response.refreshToken, currentUser);
      }
    } catch {
      logout();
    }
  }, [refreshToken, user, logout]);

  const scheduleTokenRefresh = useCallback((): void => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    refreshTimeoutRef.current = setTimeout(() => {
      refresh();
    }, TOKEN_REFRESH_INTERVAL);
  }, [refresh]);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedRefreshToken = getStoredRefreshToken();
    const storedUserId = getStoredUserId();
    const storedUser = getStoredUser();
    if (storedToken && storedUserId && storedRefreshToken) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      setUserId(storedUserId);
      setUser(storedUser);
      scheduleTokenRefresh();
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await authApi.login({ email, password });
    setToken(response.token);
    setRefreshToken(response.refreshToken);
    setUserId(response.user.id);
    setUser(response.user);
    storeAuth(response.token, response.refreshToken, response.user);
    scheduleTokenRefresh();
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<void> => {
    await authApi.register({ email, password, firstName, lastName });
  };

  const handleTokenRefresh = useCallback(async (): Promise<string | null> => {
    const currentRefreshToken = refreshToken || getStoredRefreshToken();
    if (!currentRefreshToken) {
      logout();
      return null;
    }
    try {
      const response = await authApi.refreshToken({ refreshToken: currentRefreshToken });
      setToken(response.token);
      setRefreshToken(response.refreshToken);
      const currentUser = user || getStoredUser();
      if (currentUser) {
        storeAuth(response.token, response.refreshToken, currentUser);
      }
      scheduleTokenRefresh();
      return response.token;
    } catch {
      logout();
      return null;
    }
  }, [refreshToken, user, logout, scheduleTokenRefresh]);

  useEffect(() => {
    setTokenRefreshCallback(handleTokenRefresh);
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [handleTokenRefresh]);

  const isAuthenticated = token !== null && userId !== null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        token,
        userId,
        user,
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
