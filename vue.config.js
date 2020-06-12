/**
 * @Author QJ
 * @date 2020--12 10:44
 * @desc vue.config.js
 */

module.exports = {
  devServer: {
    proxy: {
      '/egg': {
        target: 'http://127.0.0.1:7001',
        changeOrigin: true,
        pathRewrite: {
          '^/egg': '',
        }
      },
      '/express': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/express': ''
        }
      }
    }
  }
};
