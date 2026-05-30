export default {
  js: {
    entry: {
      '': ['src/js/background.js'],
      'data/interface': ['src/js/popup.js'],
    },
    filename: '[name]',
    minify: true,
    sourcemap: false,
  },
  css: {
    entry: {
      'data/interface': ['src/css/popup.css'],
    },
    filename: '[name]',
    minify: true,
    sourcemap: false,
  },
  html: {
    entry: {
      'data/interface': ['src/html/popup.html'],
    },
    filename: '[name]',
  },
  assets: {
    entry: {
      'data/icons': ['src/assets/icons'],
    },
  },
};
