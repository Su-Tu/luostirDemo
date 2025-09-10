const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    client: {
      overlay: false,
    },
  },
  // 开启代理服务器（方式1）
  // devServer: {
  //   // 这个8000要写需要通信的服务器的端口号
  //   // 也有缺陷，就是只能代理一个，不能代理多个
  //   // 不能自己决定代不代理，取决于代理服务器中的根资源目录有没有相应的文件
  //   proxy: 'http://localhost:8000'
  // }

  // 开启代理服务器（方式2）
  // devServer: {
  //   proxy: {
  //     // 在前面加一个前缀，只要有这个前缀，就肯定会进行代理
  //     '/su': {
  //       target: 'http://localhost:8000',
  //       // 这个表示要把拥有这样前缀的变为''来代替'su',避免出现服务器请求资源错误
  //       pathRewrite: { '^/su': '' },
  //       ws: true,// 用于支持websocket
  //       changeOrigin: true //用于控制请求头的host值
  //     },
  //     '/zhang': {
  //       target: 'http://localhost:8001',
  //       pathRewrite: { '^/zhang': '' },
  //       ws: true,
  //       changeOrigin: true
  //     }
  //   }
  // }
})
