import { QueryClient } from '@tanstack/react-query';
import { HttpError } from '../api/client';

const shouldRetry = (failureCount: number, error: unknown): boolean => {
  if (error instanceof HttpError) {
    return error.statusCode !== 401 && error.statusCode !== 404;
  }
  return failureCount < 3;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});
