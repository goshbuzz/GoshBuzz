import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧹 Cleaning dist directory...');
try {
  fs.rmSync(path.resolve(rootDir, 'dist'), { recursive: true, force: true });
} catch (e) {
  // ignore
}

const viteBin = path.resolve(rootDir, 'node_modules/vite/bin/vite.js');
const esbuildBin = path.resolve(rootDir, 'node_modules/esbuild/bin/esbuild');

console.log('📦 Building client bundle...');
execSync(`node "${viteBin}" build --outDir dist/client`, { stdio: 'inherit', cwd: rootDir });

console.log('⚡ Building SSR bundle...');
execSync(`node "${viteBin}" build --ssr src/entry-server.tsx --outDir dist/server`, { stdio: 'inherit', cwd: rootDir });

console.log('🛠️ Bundling server.ts...');
execSync(`node "${esbuildBin}" server.ts --bundle --platform=node --format=esm --packages=external --outfile=dist/server.js`, { stdio: 'inherit', cwd: rootDir });

console.log('🚀 Running pre-rendering and sitemap generator...');
const { prerender } = await import('./prerender.js');
await prerender();

console.log('✨ Build pipeline completed successfully!');
