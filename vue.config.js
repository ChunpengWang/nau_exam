const path = require('path');
const webpack = require('webpack');

const name = 'NAU EXAM PROJECT'; // page title

const normalProxy = 'http://localhost:3000';

const isHttps = normalProxy.indexOf('https') > -1;
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: './',
  outputDir: './server/dist',
  assetsDir: 'assets',
  /* 代码保存时进行eslint检测 */
  lintOnSave: process.env.NODE_ENV === 'development',
  /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
  productionSourceMap: false,
  /* 默认情况下，生成的静态资源在它们的文件名中包含哈希值*/
  filenameHashing: false,
  /* 本地开发调试环境服务配置 */
  devServer: {
    open: false,
    port: 8085,
    /* 一切服务都启用 gzip 压缩 */
    compress: false,
    /* 是否为https请求 */
    https: isHttps,
    // https: true,
    proxy: {
      '/api': {
        target: normalProxy,
        /* 允许跨域 */
        changeOrigin: true,
        /* 是否代理websockets */
        ws: false,
        /* 是否验证SSL Certs  配置https接口*/
        secure: false,
        /*  重写地址 将前缀 '/api' 转为 '/'*/
        pathRewrite: { '^/api': '' }
      }
    }
  },
  /* webpack配置 简单 */
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      /* 添加文件路径别名 */
      alias: {
        '@': resolve('src')
      }
    },
    performance: {
      hints: false
    },
    // externals,
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windows.jQuery': 'jquery'
      })
    ]
  },
  /* webpack配置 高级 */
  chainWebpack: config => {
    /* 移除预加载 prefetch 插件 */
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
  }
};
