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

const buildUrl = (path: string, params?: Record<string, string | number | boolean>): string => {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  return url.toString();
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
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
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return handleResponse<T>(response);
};

export const getWithAuth = async <T>(
  path: string,
  token: string,
  params?: Record<string, string | number | boolean>
): Promise<T> => {
  const url = buildUrl(path, params);
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse<T>(response);
};
