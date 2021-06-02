import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import { eslint } from 'rollup-plugin-eslint'
import bundleSize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'
import pkg from './package.json'
import css from 'rollup-plugin-css-only'
import json from '@rollup/plugin-json'

const external = Object.keys(pkg.peerDependencies)
const extensions = ['.js', '.vue']
const isProduction = !process.env.ROLLUP_WATCH
const globals = { vue: 'Vue' }

const lintOpts = {
  extensions,
  exclude: ['**/*.json', '**/*.styl'],
  cache: true,
  throwOnError: true
}

const plugins = [
  resolve({ preferBuiltins: true }),
  bundleSize(),
  commonjs(),
  css(),
  json(),
  eslint(lintOpts)
]

export default [
  // ESM build to be used with webpack/rollup.
  {
    external,
    plugins: [
      ...plugins,
      vue({
        template: {
          isProduction,
          compilerOptions: { preserveWhitespace: false }
        },
        css: false,
        compileTemplate: true
      })
    ],
    input: 'src/index.js',
    output: {
      format: 'esm',
      file: 'dist/vue-yoast.js',
      globals
    }
  },
  // SSR build.
  {
    external,
    plugins: [
      ...plugins,
      vue({
        template: {
          isProduction,
          compilerOptions: { preserveWhitespace: false, optimizeSSR: true }
        },
        css: false,
        compileTemplate: true
      })
    ],
    input: 'src/index.js',
    output: {
      format: 'cjs',
      file: 'dist/vue-yoast.cjs.js',
      globals
    }
  },
  // Browser build.
  {
    external,
    plugins: [
      ...plugins,
      vue({
        template: {
          isProduction,
          compilerOptions: { preserveWhitespace: false }
        }
      })
    ],
    input: 'src/index.js',
    output: {
      format: 'iife',
      file: 'dist/vue-yoast.iife.js',
      name: 'VueYoast',
      globals
    }
  }
]
