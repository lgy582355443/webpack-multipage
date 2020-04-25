const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

const {
    configEntry,
    configHtmlWebpackPlugin
} = require('./utils')
const {
    entryPath,
    pagesPath
} = require('./config')


module.exports = {
    // mode: 'production',
    entry: configEntry(entryPath),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[hash:8].js',
    },
    plugins: [
        //打包前清除dist文件夹
        new CleanWebpackPlugin(),
        //全局使用 jquery ，不用import导入
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery',
        }),
        //抽离css，生成css文件
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[contenthash:8].css'
        }),
        ...configHtmlWebpackPlugin(entryPath, pagesPath),
    ],
    module: {
        rules: [{
            test: /\.js$/, //js文件加载器
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
            }]
        },
        {
            test: /\.ejs$/,
            include: path.resolve(__dirname, '../src'),
            use: [{
                loader: 'html-loader',
                options: {
                    options: {
                        minimize: false, //已经使用html-webpack-plugin 压缩，这里不压缩
                        attrs: ["img:src"] //此处的参数值  img是指html中的 <img/> 标签， src是指 img的src属性   表示 html-loader 作用于 img标签中的 src的属性
                    }
                }
            },
            {
                loader: 'ejs-html-loader',
                options: {
                    production: false //已经使用html-webpack-plugin 压缩，这里不压缩
                }
            }
            ]
        },
        {
            test: /\.css$/,
            include: path.resolve(__dirname, '../src'),
            use: [
                // process.env.NODE_ENV === "development" ? {
                //     loader: 'style-loader' //生成<style>标签，把css样式加载到HTML中
                // } :
                // MiniCssExtractPlugin提取css
                {
                    loader: MiniCssExtractPlugin.loader //
                },
                {
                    loader: 'css-loader', //加载css文件
                },
                {
                    loader: 'postcss-loader' //添加css样式浏览器前缀
                }
            ]
        },
        {
            test: /\.scss$/,
            include: path.resolve(__dirname, '../src'),
            use: [
                // process.env.NODE_ENV === "development" ? {
                //     loader: 'style-loader'
                // } :
                {
                    loader: MiniCssExtractPlugin.loader
                },
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2
                    }
                },
                {
                    loader: 'postcss-loader'
                },
                {
                    loader: 'sass-loader',
                    options: {
                        implementation: require('dart-sass')
                    }
                },

            ]
        },
        {
            test: /\.(png|jpe?g|gif)(\?.*)?$/,
            include: path.resolve(__dirname, '../src'),
            use: [{
                loader: 'url-loader',
                options: {
                    //小于4096 转化为bese64
                    limit: 4 * 1024,
                    //备选方案，大于则使用file-loader，输出到指定目录
                    name: 'img/[name].[hash:8].[ext]',
                    esModule: false, //解决打包html中图片或其他静态资源引入路径自动更换
                    //因为打包后的路径问题，会在路径前面添加'../'
                    publicPath: '../'
                }
            }]
        },
        {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
            include: path.resolve(__dirname, '../src'),
            use: [{
                loader: 'file-loader',
                options: {
                    esModule: false,
                    name: 'media/[name].[hash:8].[ext]',
                    publicPath: '../'
                }
            }]
        },
        {
            test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
            include: path.resolve(__dirname, '../src'),
            use: [{
                loader: 'file-loader',
                options: {
                    esModule: false,
                    name: 'fonts/[name].[hash:8].[ext]',
                    publicPath: '../'
                }
            }]
        },
        ]
    }
}