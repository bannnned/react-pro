import { transformFile, type Options } from '@swc/core';
import { mkdir, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

const sourceFiles = [
  'build-hw/lib/index.ts',
  'build-hw/lib/math.ts',
  'build-hw/lib/string.ts',
];

const formats: Array<{
  directory: string;
  module: NonNullable<Options['module']>;
}> = [
  {
    directory: 'esm',
    module: { type: 'es6' },
  },
  {
    directory: 'cjs',
    module: { type: 'commonjs' },
  },
];

for (const format of formats) {
  const outputDirectory = join('build-hw/dist/swc', format.directory);
  await mkdir(outputDirectory, { recursive: true });

  for (const sourceFile of sourceFiles) {
    const result = await transformFile(sourceFile, {
      filename: sourceFile,
      sourceMaps: true,
      minify: true,
      jsc: {
        parser: {
          syntax: 'typescript',
        },
        target: 'es2022',
      },
      module: format.module,
    });

    const outputName = basename(sourceFile, '.ts');
    await writeFile(join(outputDirectory, `${outputName}.js`), result.code);
    await writeFile(join(outputDirectory, `${outputName}.js.map`), result.map ?? '');
  }
}

console.log('SWC-сборка готова в форматах ESM и CommonJS');
