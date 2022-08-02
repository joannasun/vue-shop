const { defineConfig } = require('@vue/cli-service')
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, //close eslint
  chainWebpack: config => {
    //path alias config
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("pages", resolve("src/pages"))
      .set("store", resolve("src/store"))
      .set("router", resolve("src/router"))
      .set("util", resolve("src/util"))
      .set("api", resolve("src/api"))

      

  },
  devServer: {                //webpack-dev-server配置 
    port : 8080,            //配置本项目运行端口
    open: true,				//配置项目第一次运行时打开页面
    proxy: {                //配置代理服务器来解决跨域问题
        '/api': {
            target: 'http://192.168.8.104:8081/api',      //配置要替换的后台接口地址
            changOrigin: true,                      //配置允许改变Origin
            pathRewrite: {
                '^/api': ''
             }
        }
    }
}

})
