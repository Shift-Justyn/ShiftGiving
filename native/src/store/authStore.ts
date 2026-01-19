import { create } from 'zustand';
import { AuthUser, AuthLoginRequest, AuthRegisterRequest } from '../api/types';
import { login as apiLogin, register as apiRegister } from '../api/auth';
import { getSecureItem, setSecureItem, removeSecureItem } from '../lib/storage';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: AuthLoginRequest) => Promise<void>;
  register: (userData: AuthRegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (credentials: AuthLoginRequest) => {
    const response = await apiLogin(credentials);
    await setSecureItem('auth_token', response.token);
    set({ user: response.user, token: response.token, isAuthenticated: true });
  },

  register: async (userData: AuthRegisterRequest) => {
    await apiRegister(userData);
  },

  logout: async () => {
    await removeSecureItem('auth_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadToken: async () => {
    const token = await getSecureItem('auth_token');
    if (token) {
      set({ token, isAuthenticated: true });
    }
  },
}));
