export default {
  js: {
    entry: { '': ['src/js/background.js'], 'ui': ['src/js/popup.js'] },
    filename: '[name]',
    minify: true,
    sourcemap: false,
  },
  css: {
    entry: { 'ui': ['src/css/popup.css'] },
    filename: '[name]',
    minify: true,
    sourcemap: false,
  },
  html: {
    entry: { 'ui': ['src/html/popup.html'] },
    filename: '[name]',
  },
  assets: {
    entry: { 'icons': ['src/assets/icons'] },
  },
};
