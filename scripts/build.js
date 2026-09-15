import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as esbuild from 'esbuild';
import { build as viteBuild } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🧹 Cleaning dist directory...');
try {
  fs.rmSync(path.resolve(rootDir, 'dist'), { recursive: true, force: true });
} catch (e) {
  // ignore
}

console.log('📦 Building client bundle...');
await viteBuild({
  root: rootDir,
  build: {
    outDir: 'dist/client',
    emptyOutDir: false,
  },
});

console.log('⚡ Building SSR bundle...');
await viteBuild({
  root: rootDir,
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'dist/server',
    emptyOutDir: false,
  },
});

console.log('🛠️ Bundling server.ts...');
await esbuild.build({
  entryPoints: [path.resolve(rootDir, 'server.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  outfile: path.resolve(rootDir, 'dist/server.js'),
});

console.log('🚀 Running pre-rendering and sitemap generator...');
const { prerender } = await import('./prerender.js');
await prerender();

console.log('🔎 Checking published styles, scripts, and images...');
const { checkDeployment } = await import('./check-build.js');
checkDeployment(rootDir);

console.log('✨ Build pipeline completed successfully!');
