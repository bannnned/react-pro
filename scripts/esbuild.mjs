import { build } from 'esbuild';
import { cp, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

const outdir = resolve('dist-esbuild');
await rm(outdir, { recursive: true, force: true });
const { metafile } = await build({
	entryPoints: { main: 'src/index.tsx' },
	outdir,
	entryNames: 'assets/[name]-[hash]',
	assetNames: 'assets/[name]-[hash]',
	publicPath: '/',
	bundle: true,
	minify: true,
	metafile: true,
	target: 'es2020',
	format: 'iife',
	jsx: 'automatic',
	loader: {
		'.module.css': 'local-css',
		'.svg': 'file',
		'.png': 'file',
		'.jpg': 'file',
		'.webp': 'file',
	},
	define: {
		'process.env.NODE_ENV': '"production"',
		'process.env.API_URL': JSON.stringify(process.env.API_URL || '/api'),
	},
});
const [entry, info] = Object.entries(metafile.outputs).find(
	([, file]) => file.entryPoint === 'src/index.tsx'
);
const webPath = (path) =>
	'/' + relative(outdir, resolve(path)).split(sep).join('/');
const template = await readFile('public/index.html', 'utf8');
const html = template
	.replace(
		'</head>',
		'  <link rel="stylesheet" href="' + webPath(info.cssBundle) + '">\n</head>'
	)
	.replace(
		'</body>',
		'  <script defer src="' + webPath(entry) + '"></script>\n</body>'
	);
await writeFile(resolve(outdir, 'index.html'), html);
await cp('public/media', resolve(outdir, 'media'), { recursive: true });
console.log('esbuild →', relative(dirname(outdir), outdir));
