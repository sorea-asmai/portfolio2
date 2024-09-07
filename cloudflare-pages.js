import { handleRequest } from '@cloudflare/kv-asset-handler';
import { onRequest } from './cloudflare-pages';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event, { onRequest }));
});