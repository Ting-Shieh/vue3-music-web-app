const registerRouter = require('./backend/router')
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 全局引入變量和 mixin
        prependData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },
  devServer: {
    // https://webpack.js.org/configuration/dev-server/#devserversockhost
    // sockHost: '192.168.68.102:8080',
    // disableHostCheck: true,
    before (app) {
      registerRouter(app)
    }
    // proxy: {
    //   '/api': {
    //     target: 'http://192.168.68.102:8080',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  },
  configureWebpack: (config) => {
    if (process.env.npm_config_report) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      config.plugins.push(new BundleAnalyzerPlugin())
    }
  },
  productionSourceMap: false,

  publicPath: process.env.NODE_ENV === 'production' ? '/music-next/' : '/'
}
