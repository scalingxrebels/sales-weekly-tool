import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import cookieParser from 'cookie-parser';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';

export const config = {
  runtime: 'nodejs',
};

// Export handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Create Express app for each request (Vercel serverless is stateless)
  const app = express();
  
  // Configure middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());
  
  // tRPC API - mount at root since we're already at /api
  app.use(
    '/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  
  // Rewrite URL to remove /api prefix for Express routing
  const originalUrl = req.url || '';
  req.url = originalUrl.replace(/^\/api/, '');
  
  // Handle the request
  return app(req as any, res as any);
}

