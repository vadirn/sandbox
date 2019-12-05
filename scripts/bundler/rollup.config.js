const { resolve, isProduction, isDevelopment, mode } = require('./env');
const replace = require('rollup-plugin-replace');
const alias = require('./rollup-plugin-alias');
const assets = require('./rollup-plugin-assets');
const scss = require('./rollup-plugin-scss');
const svelte = require('rollup-plugin-svelte');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const livereload = require('rollup-plugin-livereload');
const { terser } = require('rollup-plugin-terser');

exports.input = {
  input: resolve('src', 'main.js'),
  onwarn: warning => {
    // ignore some of the circular deps warnings
    const ignore = ['core-js'];
    if (
      warning.code === 'CIRCULAR_DEPENDENCY' &&
      ignore.some(dep => warning.importer.includes(dep))
    ) {
      return;
    }
    throw warning;
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
    alias({
      session: resolve('src', 'session'),
      assets: resolve('src', 'assets'),
      controllers: resolve('src', 'controllers'),
      services: resolve('src', 'services'),
      ui: resolve('src', 'ui'),
    }),
    assets(),
    scss({ mode }),
    svelte({
      dev: mode === 'development',
      emitCss: true,
    }),
    babel({
      exclude: /(src?!\/)node_modules(?!\/svelte)/,
      include: [resolve('src') + '/**', resolve('node_modules') + '/svelte/**'],
      extensions: ['.js', '.mjs', '.svelte'],
      envName: mode,
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'usage', // import polyfill when used
            targets: {
              browsers: [
                '> 0.5%',
                'last 2 versions',
                'Firefox ESR',
                'not dead',
              ],
            },
            modules: false, // do not transform modules
            corejs: 3, // polyfills version
          },
        ],
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator',
      ],
    }),
    nodeResolve({ browser: true }),
    commonjs(),
    isDevelopment && livereload({ watch: resolve('dist') }),
    isProduction && terser(),
  ],
};

exports.output = {
  dir: resolve('dist', 'assets'),
  format: 'system',
  entryFileNames: (isProduction && '[name].[hash].js') || '[name].js',
  chunkFileNames: (isProduction && '[name].[hash].js') || '[name].js',
};
