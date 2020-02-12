const path = require('path')
module.exports = {
    src: '../src',
    //匹配入口js文件路径
    entryPath: path.resolve(__dirname, '../src/pages') + "/*/*.js",
    //匹配页面html文件路径
    pagesPath: path.resolve(__dirname, '../src/pages') + "/*/*.ejs",
    //生产环境分割代码后打包要引入的块
    prodChunks: ['default', 'vendors', 'styles', 'runtime'],
    //开发环境不分割代码
    devChunks: [],
}