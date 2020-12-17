
module.exports = {
  outputDir: 'dist',  //build输出目录
  assetsDir: 'assets', //静态资源目录（js, css, img）
  lintOnSave: false, //是否开启eslint
  devServer: {
    open: true, //是否自动弹出浏览器页面
    // host: "localhost", //表示启动的时候使用的域名，默认可以不写，则是使用localhost和本机IP
    // port: '8081', // 设置端口号
    https: false,  //是否使用https协议
    hotOnly: true, //是否开启热更新
    proxy: {
      '/proxy':{
        target: 'http://192.168.1.177:8000', // 
        ws: true, // websockets
        changeOrigin: true,  // needed for virtual hosted sites
        pathRewrite: {
          '^/proxy': ''
        }
      }
    }
  }
}