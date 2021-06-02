import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import bundleSize from 'rollup-plugin-filesize'
import { eslint } from 'rollup-plugin-eslint'
import vue from 'rollup-plugin-vue'
import css from 'rollup-plugin-css-only'
import pkg from './package.json'

const external = Object.keys(pkg.peerDependencies)
external.push('util')
external.push('url')
external.push('htmlparser2')
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
  nodeResolve({ preferBuiltins: true }),
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
