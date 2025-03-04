import { build } from 'esbuild';
import { promises as fs } from 'fs';

await build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    outdir: 'dist',
    platform: 'node',
    sourcemap: false,
    tsconfig: 'tsconfig.json',
});
await fs.copyFile('src-loader/lib.js', 'dist/lib.js');