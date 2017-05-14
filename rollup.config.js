import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/http/index.js',
  dest: 'httpd.js',
  format: 'iife',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ]
};