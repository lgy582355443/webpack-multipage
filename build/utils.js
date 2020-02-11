const htmlWebpackPlugin = require("html-webpack-plugin")
const glob = require('glob')

// //递归遍历页面目录
// function readFileList(dir, fileList) {
//     //获取文件夹绝对路径
//     const url = path.resolve(__dirname, dir)
//     //获取文件夹下的文件列表 (返回一个包含“指定目录下所有文件名称”的数组对象。)
//     const files = fs.readdirSync(url)
//     files.forEach(file => {
//         let fullPath = path.join(url, file)
//         const stat = fs.statSync(fullPath)
//         //判断是否为文件夹
//         if (stat.isDirectory()) {
//             fileList[file] = {
//                 html: '',
//                 js: '',
//                 scss: ''
//             }
//             readFileList(fullPath, fileList)
//         } else {
//             let ext = file.split('.')[file.split('.').length - 1];
//             let filename = file.slice(0, file.lastIndexOf('.'));
//             fileList[filename][ext] = fullPath;
//         }
//     })
//     return fileList
// }

//构建entry
function configEntry(entryPath) {
    return glob.sync(entryPath).reduce((entry, entryItem) => {
        const file = entryItem.slice(entryItem.lastIndexOf('/') + 1)
        const filename = file.slice(0, file.lastIndexOf('.'))
        entry[filename] = entryItem
        return entry
    }, {})
}
// //设置入口
function configHtmlWebpackPlugin(entryPath, pagesPath) {
    //获取入口配置
    const entry = configEntry(entryPath);
    return glob.sync(pagesPath).reduce((htmlWebpackPluginArr, page) => {
        const file = page.slice(page.lastIndexOf('/') + 1)
        const filename = file.slice(0, file.lastIndexOf('.'))
        let chunks = [];
        //判断该页面是否引入js文件
        if (entry[filename]) {
            chunks = [filename]
        }
        htmlWebpackPluginArr.push(new htmlWebpackPlugin({
            filename: `pages/${filename}.html`, //生成html文件名
            template: page, //指定模板的位置
            chunks, //指定需要引入哪个模块
            inject: 'body', //动态script标签插入body中
            minify: process.env.NODE_ENV === "development" ? false : { //压缩html文件
                removeComments: true, //移除html中的注释
                collapseWhitespace: true, //删除空白符和换行符
                minifyCSS: true //压缩内联css
            }
        }))
        return htmlWebpackPluginArr
    }, [])
}

module.exports = {
    configEntry,
    configHtmlWebpackPlugin
}