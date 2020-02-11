## 启动

```
npm install
```

```
npm run dev  //开发环境
```

```
npm run build //打包
```



### 初始化

```
npm init
```

```
npm webpack webpack-cli -D
```



### 配置多页打包

- 安装golb,用于通过匹配规则查找相应文件，返回相应文件路径数组。
- 安装 html-webpack-plugin，用于打包html文件，自动引入js文件

```
npm i html-webpack-plugin glob -D
```

构建entry函数

```javascript
//查找/ser/pages文件夹下所有js文件作为入口：entryPath=path.resolve(__dirname,'../src/pages')+"/**/*.html"
function setEntry(entryPath) {
    //传入entry查找规则，先获取入口js文件路径组成的数组
    return glob.sync(entryPath).reduce((entry, entryItem) => {
        //file: index.js
        const file = entryItem.slice(entryItem.lastIndexOf('/') + 1)
        //filename: index
        const filename = file.slice(0, file.lastIndexOf('.'))
        entry[filename] = entryItem
        return entry
    }, {})
}
```

构建htmlWebpackPlugin,根据html生成多个new htmlWebpackPlugin

```javascript
function configHtmlWebpackPlugin(entryPath) {
    //获取入口配置
    const entry = setEntry(entryPath);
    return glob.sync(pagesPath).reduce((htmlWebpackPluginArr, page) => {
        const file = entryItem.slice(entryItem.lastIndexOf('/') + 1)
        const filename = file.slice(0, file.lastIndexOf('.'))
        const chunks = [];
        //判断该页面是否引入js文件
        if (entry[filename]) {
            chunks = [filename]
        }
        htmlWebpackPluginArr.push(new htmlWebpackPlugin({
            filename: `pages/${file}`, //生成html文件名
            template: page, //指定模板的位置
            chunks, //指定需要引入哪个模块,不写会默认引入所有入口文件
            inject: 'body', //动态script标签插入body中
            minify: { //压缩html文件
                removeComments: true, //移除html中的注释
                collapseWhitespace: true, //删除空白符和换行符
                minifyCSS: true //压缩内联css
            }
        }))
        return htmlWebpackPluginArr
    }, [])
}
```

设置 `process.env.NODE_ENV` ，指定不同打包模式

```
npm i cross-env -D
```

修改package.json中的script脚本

```javascript
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "cross-env NODE_ENV=development webpack --config ./build/webpack.config.js"
  },
```

修改上面configHtmlWebpackPlugin函数中的，在developement开放模式不压缩html

```javascript
function configHtmlWebpackPlugin(entryPath) {
    ...省略
htmlWebpackPluginArr.push(new htmlWebpackPlugin({
          .....省略
            minify:  process.env.NODE_ENV === "development" ? false :{ //压缩html文件
                removeComments: true, //移除html中的注释
                collapseWhitespace: true, //删除空白符和换行符
                minifyCSS: true //压缩内联css
            }
        }))
```

### 配置loader

创建/build/rules.js存放公共的module.rules

css

```
npm i css-loader style-loader -D
```

sass

```
npm i sass-loader dart-sass -D
```

less

```
npm i less-loader less -D
```

静态静态资源

```
npm i file-loader url-loader -D
```

添加浏览器前缀

```
 npm i postcss-loader autoprefixer -D
```

项目根创建 `.browserslidtrc` 文件

```
> 1%
last 2 versions
not ie <= 8
```

配置babel

```
npm i babel-loader @babel/core @babel/preset-env -D
```

新建`.babelrc`文件

```
{
  "presets": ["env"]
}
```

