/**
 * Build script for Netlify Functions
 * Bundles src/netlify-entry.ts to netlify/functions/api.js
 */
import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function build() {
  try {
    console.log('Building Netlify Functions...');
    
    await esbuild.build({
      entryPoints: [resolve(__dirname, 'src/netlify-entry.ts')],
      bundle: true,
      platform: 'node',
      target: 'node22',
      format: 'cjs',
      outfile: resolve(__dirname, 'netlify/functions/api.js'),
      external: [],
      minify: false,
      sourcemap: true,
      logLevel: 'info',
    });
    
    console.log('✅ Netlify Functions built successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();

