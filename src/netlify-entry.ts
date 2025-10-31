/**
 * Netlify Function Entry Point
 * Direct tRPC HTTP Handler without Express
 */
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../server/routers';
import { createContext } from '../server/_core/context';

// Export Netlify Function handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    // Convert Netlify event to Fetch API Request
    const url = new URL(event.path, `https://${event.headers.host || 'localhost'}`);
    
    // Remove /.netlify/functions/api prefix
    const path = event.path.replace('/.netlify/functions/api', '');
    url.pathname = path;
    
    const request = new Request(url.toString(), {
      method: event.httpMethod,
      headers: new Headers(event.headers as Record<string, string>),
      body: event.body || undefined,
    });
    
    // Use tRPC fetch adapter
    const response = await fetchRequestHandler({
      endpoint: '/trpc',
      req: request,
      router: appRouter,
      createContext: async ({ req }) => {
        // Convert Fetch Request to Express-like request for context
        const mockReq: any = {
          headers: Object.fromEntries(req.headers.entries()),
          cookies: {},
        };
        
        // Parse cookies from header
        const cookieHeader = req.headers.get('cookie');
        if (cookieHeader) {
          cookieHeader.split(';').forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            if (key && value) {
              mockReq.cookies[key] = decodeURIComponent(value);
            }
          });
        }
        
        const mockRes: any = {
          setHeader: () => {},
          cookie: () => {},
          clearCookie: () => {},
        };
        
        return createContext({ req: mockReq, res: mockRes });
      },
    });
    
    // Convert Fetch Response to Netlify response
    const body = await response.text();
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    return {
      statusCode: response.status,
      headers,
      body,
    };
  } catch (error: any) {
    console.error('Netlify Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      }),
    };
  }
};

