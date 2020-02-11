const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const webpackConfig = require('./webpack.config')

module.exports = merge(webpackConfig, {
    mode: 'development',
    //此选项控制是否生成，以及如何生成 source map。这里选原始源代码
    devtool: 'cheap-module-eval-source-map',
    //开启本地服务
    devServer: {
        hot: true, //启用 webpack 的模块热替换特性：
        host: 'localhost', //指定使用一个 host。默认是 localhost
        port: 8080, //服务端口
        open: true, //启动时打开默认浏览器
        openPage:"http://localhost:8080/pages/home.html"//指定打开的网页
    },
    plugins: [
        //定义环境变量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
                BASE_URL: JSON.stringify('http://localhost:8080')
            }
        }),
        //这个插件的作用是在热加载时直接返回更新文件名
        new webpack.NamedModulesPlugin(),
        //修改内容后不用刷新页面，保存就自动更新
        new webpack.HotModuleReplacementPlugin(),
    ],
})