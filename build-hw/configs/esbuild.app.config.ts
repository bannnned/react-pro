import { build, context, type BuildOptions } from 'esbuild';

const isDev = process.argv.includes('--dev');

const options: BuildOptions = {
  entryPoints: ['build-hw/app/index.ts'],
  outdir: 'build-hw/dist',
  entryNames: 'app',
  chunkNames: 'chunks/[name]-[hash]',
  bundle: true,
  splitting: true,
  format: 'esm',
  treeShaking: true,
  minify: !isDev,
  sourcemap: !isDev,
};

if (isDev) {
  const buildContext = await context(options);
  await buildContext.watch();
} else {
  await build(options);
}
