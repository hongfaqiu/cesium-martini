import { readFileSync } from 'fs';
import esbuild from 'rollup-plugin-esbuild';
import path from 'path';
import dts from 'rollup-plugin-dts';
import resolve from "@rollup/plugin-node-resolve";
import webWorkerLoader from "rollup-plugin-web-worker-loader";
import commonjs from '@rollup/plugin-commonjs';

const pkg = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url)).toString(),
);

const deps = { ...pkg.dependencies, ...pkg.peerDependencies };
const external = Object.keys(deps);

const extensions = ["ts", "js"]
const plugins = [
  commonjs(),
  resolve({ extensions, module: true }),
  webWorkerLoader({
    extensions: ["ts", "js"],
  }),
  esbuild({
    target: 'node14',
  }),
]


/**
 * @type {import('rollup').RollupOptions}
 */
const config = [
  {
    input: 'src/index.ts',
    output: {
      dir: path.dirname(pkg.main),
      format: 'amd',
      sourcemap: true,
    },
    external,
    plugins,
  }, 
  {
    input: 'src/index.ts',
    output: {
      dir: path.dirname(pkg.module),
      format: 'esm',
      sourcemap: true,
    },
    external,
    plugins,
  }, 
  {
    input: 'src/index.ts',
    output: {
      dir: path.dirname(pkg.types),
      entryFileNames: '[name].d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },
];

export default config;