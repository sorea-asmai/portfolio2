import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';

import * as build from '../build/server';

import pkg from 'react-dom/server';
const { renderToReadableStream } = pkg;

export const onRequest = createPagesFunctionHandler({ build });
