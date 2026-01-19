import { HttpError } from '../../src/api/client';

describe('HttpError', () => {
  it('creates error with status code and message', () => {
    const error = new HttpError(404, 'Not found');
    expect(error.statusCode).toBe(404);
  });

  it('sets error message correctly', () => {
    const error = new HttpError(500, 'Server error');
    expect(error.message).toBe('Server error');
  });

  it('sets error name to HttpError', () => {
    const error = new HttpError(400, 'Bad request');
    expect(error.name).toBe('HttpError');
  });

  it('extends Error class', () => {
    const error = new HttpError(403, 'Forbidden');
    expect(error instanceof Error).toBe(true);
  });

  it('extends HttpError class', () => {
    const error = new HttpError(401, 'Unauthorized');
    expect(error instanceof HttpError).toBe(true);
  });
});
