import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

const API_BASE = 'http://localhost:5237';

worker.events.on('request:start', ({ request }) => {
  if (request.url.startsWith(API_BASE)) {
    console.log('[MSW] API Request:', request.method, request.url);
  }
});

worker.events.on('request:unhandled', ({ request }) => {
  if (request.url.startsWith(API_BASE)) {
    console.warn('[MSW] Unhandled API request:', request.method, request.url);
  }
});
