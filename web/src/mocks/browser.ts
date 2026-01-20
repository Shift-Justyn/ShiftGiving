import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

worker.events.on('request:start', ({ request }) => {
  console.log('[MSW] Intercepting:', request.method, request.url);
});

worker.events.on('request:unhandled', ({ request }) => {
  console.warn('[MSW] Unhandled request:', request.method, request.url);
});
