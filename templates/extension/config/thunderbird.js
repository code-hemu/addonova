export default {
  js: {
    entry: {
      '': ['src/js/background.js', 'src/js/popup.js'],
    },
    filename: '[name]',
    minify: true,
    sourcemap: false,
  },
  css: {
    entry: {
      '': ['src/css/popup.css'],
    },
    filename: '[name]',
    minify: true,
    sourcemap: false,
  },
  html: {
    entry: {
      '': ['src/html/popup.html'],
    },
    filename: '[name]',
  },
  assets: {
    entry: {
      '': ['src/assets/**/*'],
    },
  },
};
