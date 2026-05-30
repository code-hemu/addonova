export default {
  js: {
    entry: {
      '': ['src/js/background.js'],
      'lib': [
          'platform/naver/platform.js', 
          'src/js/lib/browser.js', 
          'src/js/lib/runtime.js', 
          'src/js/lib/config.js', 
          'src/js/lib/common.js'
      ],
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