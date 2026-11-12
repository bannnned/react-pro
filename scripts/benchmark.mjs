import { spawnSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const targets = [
	{
		name: 'Webpack',
		command: [
			'node_modules/webpack/bin/webpack.js',
			'--config',
			'webpack/webpack.config.js',
			'--mode',
			'production',
			'--stats=errors-only',
		],
		dir: 'dist',
	},
	{ name: 'esbuild', command: ['scripts/esbuild.mjs'], dir: 'dist-esbuild' },
];
const rounds = 3;
const timings = new Map(targets.map(({ name }) => [name, []]));

for (let round = 0; round < rounds; round++) {
	for (const { name, command } of round % 2 ? targets.toReversed() : targets) {
		const start = performance.now();
		const run = spawnSync(process.execPath, command, { encoding: 'utf8' });
		if (run.status !== 0)
			throw new Error(
				run.error?.message || run.stderr || run.stdout || name + ' failed'
			);
		timings.get(name).push((performance.now() - start) / 1000);
	}
}

for (const { name, dir } of targets) {
	const samples = timings.get(name).sort((a, b) => a - b);
	let bytes = 0;
	let gzip = 0;
	const files = await readdir(dir, { recursive: true, withFileTypes: true });
	for (const file of files.filter(
		(file) => file.isFile() && /\.(js|css)$/.test(file.name)
	)) {
		const buffer = await readFile(join(file.parentPath, file.name));
		bytes += buffer.length;
		gzip += gzipSync(buffer).length;
	}
	console.log(
		name + ': ' + samples.map((time) => time.toFixed(2)).join(' / ') + ' s'
	);
	console.log(
		'  median ' +
			samples[1].toFixed(2) +
			' s, ' +
			bytes +
			' B, gzip ' +
			gzip +
			' B'
	);
}
