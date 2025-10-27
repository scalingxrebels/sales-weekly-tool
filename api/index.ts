import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cookieParser from 'cookie-parser';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';

// Create Express app for Vercel serverless
const app = express();

// Configure middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// tRPC API
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Export handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Rewrite path to remove /api prefix for Express routing
  const originalUrl = req.url || '';
  req.url = originalUrl.replace(/^\/api/, '/api');
  
  return app(req as any, res as any);
}

