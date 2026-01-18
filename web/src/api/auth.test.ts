import * as client from './client';
import { login, register } from './auth';

jest.mock('./client');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('login', () => {
  it('calls post with credentials', async () => {
    const mockResponse = { token: 'abc123', userId: 'user1' };
    (client.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await login({ email: 'test@example.com', password: 'password123' });

    expect(result).toEqual(mockResponse);
  });
});

describe('login endpoint', () => {
  it('uses correct endpoint', async () => {
    (client.post as jest.Mock).mockResolvedValue({ token: 'abc123', userId: 'user1' });

    await login({ email: 'test@example.com', password: 'password123' });

    expect(client.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });
  });
});

describe('register', () => {
  it('calls post with user data', async () => {
    (client.post as jest.Mock).mockResolvedValue(undefined);

    await register({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(client.post).toHaveBeenCalled();
  });
});

describe('register endpoint', () => {
  it('uses correct endpoint', async () => {
    (client.post as jest.Mock).mockResolvedValue(undefined);

    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    await register(userData);

    expect(client.post).toHaveBeenCalledWith('/api/auth/register', userData);
  });
});

describe('register returns void', () => {
  it('returns void', async () => {
    (client.post as jest.Mock).mockResolvedValue(undefined);

    const result = await register({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(result).toBeUndefined();
  });
});
