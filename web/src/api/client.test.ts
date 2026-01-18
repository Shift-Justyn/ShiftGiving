import { get, post, HttpError } from './client';

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('buildUrl via get', () => {
  it('builds url without params', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    await get('/test');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5237/test');
  });
});

describe('buildUrl with params via get', () => {
  it('builds url with query params', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    await get('/test', { page: 1, pageSize: 10 });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5237/test?page=1&pageSize=10');
  });
});

describe('handleResponse success', () => {
  it('returns json data', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: 'test', error: null }),
    });

    const result = await get('/test');

    expect(result).toEqual('test');
  });
});

describe('handleResponse error with json', () => {
  it('throws HttpError with message', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ message: 'Not found', statusCode: 404 }),
    });

    await expect(get('/test')).rejects.toThrow('Not found');
  });
});

describe('handleResponse error without json', () => {
  it('throws HttpError with default message', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => Promise.reject(new Error('Invalid JSON')),
    });

    await expect(get('/test')).rejects.toThrow('Request failed');
  });
});

describe('get request', () => {
  it('makes GET request', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    await get('/test');

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5237/test');
  });
});

describe('post request', () => {
  it('makes POST request with body', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    await post('/test', { key: 'value' });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5237/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'value' }),
    });
  });
});

describe('HttpError statusCode', () => {
  it('includes status code', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized', statusCode: 401 }),
    });

    try {
      await get('/test');
    } catch (error) {
      expect((error as HttpError).statusCode).toBe(401);
    }
  });
});
