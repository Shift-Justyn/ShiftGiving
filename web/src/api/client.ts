import { ApiError } from './types';

const BASE_URL = 'http://localhost:5237';

interface ApiWrapper<T> {
  success: boolean;
  data: T;
  error: { code: string; message: string } | null;
}

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

let tokenRefreshCallback: (() => Promise<string | null>) | null = null;

export const setTokenRefreshCallback = (callback: () => Promise<string | null>): void => {
  tokenRefreshCallback = callback;
};

const buildUrl = (path: string, params?: Record<string, string | number | boolean>): string => {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  return url.toString();
};

const handleResponse = async <T>(
  response: Response,
  shouldRetryOn401: boolean = true
): Promise<T> => {
  if (!response.ok) {
    if (response.status === 401 && shouldRetryOn401 && tokenRefreshCallback) {
      throw new HttpError(401, 'Unauthorized');
    }
    const error: ApiError = await response.json().catch(() => ({
      message: 'Request failed',
      statusCode: response.status,
    }));
    throw new HttpError(error.statusCode, error.message);
  }
  const json: ApiWrapper<T> = await response.json();
  if (!json.success && json.error) {
    throw new HttpError(400, json.error.message);
  }
  return json.data;
};

export const get = async <T>(
  path: string,
  params?: Record<string, string | number | boolean>
): Promise<T> => {
  const url = buildUrl(path, params);
  const response = await fetch(url);
  return handleResponse<T>(response);
};

export const post = async <T>(path: string, body: unknown, token?: string): Promise<T> => {
  const url = buildUrl(path);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof HttpError && error.statusCode === 401 && token && tokenRefreshCallback) {
      const newToken = await tokenRefreshCallback();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        });
        return await handleResponse<T>(retryResponse, false);
      }
    }
    throw error;
  }
};

export const getWithAuth = async <T>(
  path: string,
  token: string,
  params?: Record<string, string | number | boolean>
): Promise<T> => {
  const url = buildUrl(path, params);
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof HttpError && error.statusCode === 401 && tokenRefreshCallback) {
      const newToken = await tokenRefreshCallback();
      if (newToken) {
        const retryResponse = await fetch(url, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        return await handleResponse<T>(retryResponse, false);
      }
    }
    throw error;
  }
};

export const postMultipart = async <T>(
  path: string,
  formData: FormData,
  token?: string
): Promise<T> => {
  const url = buildUrl(path);
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof HttpError && error.statusCode === 401 && token && tokenRefreshCallback) {
      const newToken = await tokenRefreshCallback();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, {
          method: 'POST',
          headers,
          body: formData,
        });
        return await handleResponse<T>(retryResponse, false);
      }
    }
    throw error;
  }
};

export const del = async <T>(path: string, token?: string): Promise<T> => {
  const url = buildUrl(path);
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    return await handleResponse<T>(response);
  } catch (error) {
    if (error instanceof HttpError && error.statusCode === 401 && token && tokenRefreshCallback) {
      const newToken = await tokenRefreshCallback();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryResponse = await fetch(url, {
          method: 'DELETE',
          headers,
        });
        return await handleResponse<T>(retryResponse, false);
      }
    }
    throw error;
  }
};
