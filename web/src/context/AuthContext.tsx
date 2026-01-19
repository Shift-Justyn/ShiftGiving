import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authApi from '../api/auth';
import { AuthUser } from '../api/types';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  userId: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';
const USER_KEY = 'auth_user';

const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
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

const storeAuth = (token: string, user: AuthUser): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_ID_KEY, user.id);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_KEY);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUserId = getStoredUserId();
    const storedUser = getStoredUser();
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await authApi.login({ email, password });
    setToken(response.token);
    setUserId(response.user.id);
    setUser(response.user);
    storeAuth(response.token, response.user);
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<void> => {
    await authApi.register({ email, password, firstName, lastName });
  };

  const logout = (): void => {
    setToken(null);
    setUserId(null);
    setUser(null);
    clearAuth();
  };

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
