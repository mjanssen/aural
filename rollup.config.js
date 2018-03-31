import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  input: './src/index.js',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify({
      output: { comments: false },
      compress: {
        keep_infinity: true,
        pure_getters: true,
      },
      warnings: true,
      ecma: 5,
      toplevel: 'cjs',
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
    }),
  ],
};
