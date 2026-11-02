import { build, type BuildOptions } from 'esbuild';

const entryPoints = {
  index: 'build-hw/lib/index.ts',
  math: 'build-hw/lib/math.ts',
  string: 'build-hw/lib/string.ts',
};

const commonOptions: BuildOptions = {
  entryPoints,
  bundle: true,
  external: ['react'],
  minify: true,
  sourcemap: true,
  treeShaking: true,
};

await Promise.all([
  build({
    ...commonOptions,
    outdir: 'build-hw/dist/esm',
    format: 'esm',
  }),
  build({
    ...commonOptions,
    outdir: 'build-hw/dist/cjs',
    format: 'cjs',
  }),
]);
