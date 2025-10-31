#!/usr/bin/env node
/**
 * Build API handlers for Vercel deployment
 * Bundles TypeScript + dependencies into single JavaScript files
 */
import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildAPI() {
  console.log('🔨 Building API handlers for Vercel...\n');

  const apiDir = join(__dirname, 'api');
  if (!existsSync(apiDir)) {
    mkdirSync(apiDir, { recursive: true });
  }

  // Bundle tRPC handler
  try {
    await esbuild.build({
      entryPoints: [join(__dirname, 'src/api-entry.ts')],
      bundle: true,
      platform: 'node',
      target: 'node22',
      format: 'cjs',
      outfile: join(apiDir, 'index.js'),
      external: ['pg-native'], // Vercel provides this
      minify: false,
      sourcemap: true,
      logLevel: 'info',
    });

    console.log('✅ API handlers built successfully!');
    console.log('   → api/index.js\n');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildAPI();

