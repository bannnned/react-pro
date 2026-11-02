import { build, context, type BuildOptions } from 'esbuild';
import { rm } from 'node:fs/promises';

const isDev = process.argv.includes('--dev');

const options: BuildOptions = {
  entryPoints: ['build-hw/app/index.ts'],
  outdir: 'build-hw/dist',
  entryNames: 'app',
  chunkNames: 'chunks/[name]-[hash]',
  bundle: true,
  splitting: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  treeShaking: true,
  minify: !isDev,
  sourcemap: !isDev,
  logLevel: 'info',
};

await rm('build-hw/dist', { recursive: true, force: true });

if (isDev) {
  const buildContext = await context(options);
  await buildContext.watch();
  console.log('Dev-сборка запущена в режиме watch');
} else {
  await build(options);
}
