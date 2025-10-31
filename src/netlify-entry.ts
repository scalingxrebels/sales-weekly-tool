/**
 * Netlify Function Entry Point
 * This file is bundled to netlify/functions/api.js
 */
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cookieParser from 'cookie-parser';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';

// Create Express app
const app = express();

// Configure middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// tRPC API - mount at /trpc
app.use(
  '/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Export Netlify Function handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Convert Netlify event to Express-compatible request
  const path = event.path.replace('/.netlify/functions/api', '');
  
  return new Promise((resolve) => {
    const req: any = {
      method: event.httpMethod,
      url: path,
      headers: event.headers,
      body: event.body,
    };
    
    const res: any = {
      statusCode: 200,
      headers: {},
      body: '',
      status(code: number) {
        this.statusCode = code;
        return this;
      },
      setHeader(key: string, value: string) {
        this.headers[key] = value;
        return this;
      },
      send(data: any) {
        this.body = typeof data === 'string' ? data : JSON.stringify(data);
        resolve({
          statusCode: this.statusCode,
          headers: this.headers,
          body: this.body,
        });
      },
      json(data: any) {
        this.headers['Content-Type'] = 'application/json';
        this.send(data);
      },
    };
    
    app(req, res);
  });
};

