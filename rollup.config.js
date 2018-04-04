import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const uglifySettings = {
  output: { comments: false },
  compress: {
    negate_iife: false,
    unsafe_comps: true,
    properties: true,
    keep_fargs: false,
    pure_getters: true,
    collapse_vars: true,
    unsafe: true,
    warnings: false,
    sequences: true,
    dead_code: true,
    drop_debugger: true,
    comparisons: true,
    conditionals: true,
    evaluate: true,
    booleans: true,
    loops: true,
    unused: true,
    hoist_funs: true,
    if_return: true,
    join_vars: true,
    drop_console: true,
    pure_funcs: ['classCallCheck', 'invariant', 'warning'],
  },
  warnings: true,
  ecma: 5,
  toplevel: 'cjs',
  mangle: {
    properties: {
      regex: /^_/,
    },
  },
};

export default {
  input: './src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify(uglifySettings),
  ],
};
