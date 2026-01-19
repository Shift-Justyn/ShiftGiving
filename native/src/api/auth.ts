import { post } from './client';
import { AuthLoginRequest, AuthLoginResponse, AuthRegisterRequest } from './types';

export const login = (credentials: AuthLoginRequest): Promise<AuthLoginResponse> => {
  return post<AuthLoginResponse>('/api/auth/login', credentials);
};

export const register = (userData: AuthRegisterRequest): Promise<void> => {
  return post<void>('/api/auth/register', userData);
};
