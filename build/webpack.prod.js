const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config')
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')
const glob = require('glob-all')
const PurifyCssWebpackPlugin = require('purgecss-webpack-plugin')

module.exports = merge(webpackConfig, {
    //编译模式,'development'不会压缩代码，'production'压缩代码
    mode: 'production',
    //优化
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                    compress: {
                        // drop_console: true, //去除console
                    }
                }
            }),
        ],
        // 分割代码
        splitChunks: {
            chunks: "async", //分割异步打包的代码
            minSize: 30 * 1024, //模块大于30k会被抽离到公共模块
            minChunks: 1, //默认模块出现1次就会被抽离到公共模块
            maxAsyncRequests: 5, //异步模块，一次最多只能被加载5个
            maxInitialRequests: 3, //入口模块最多只能加载3个
            name: true, //打包后的名称，默认是chunk的名字通过分隔符（默认是～）分隔开，如vendor~
            cacheGroups: { //设置缓存组用来抽取满足不同规则的chunk,
                default: {
                    minChunks: 2, //模块出现2次就会被抽离到公共模块
                    priority: 10, //优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中
                    reuseExistingChunk: true, //	如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
                },
                //单独打包生产环境依赖
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial',
                    priority: 20,
                    name: 'vendors',
                },
                // 将项目所有css打包到一个文件中
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true //强制分割
                }
            }
        },
        // runtimeChunk: {
        //     name: "runtime"
        // }
    },
    plugins: [
        //定义环境变量
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                BASE_URL: JSON.stringify('http://localhost:8080')
            }
        }),
        //压缩打包的css文件
        new OptimizeCssnanoPlugin({
            sourceMap: true,
            cssnanoOptions: {
                preset: [
                    'default',
                    {
                        mergeLonghand: false,
                        cssDeclarationSorter: false
                    }
                ]
            }
        }),
        //消除多余的css
        new PurifyCssWebpackPlugin({
            paths: glob.sync(path.resolve(__dirname, '../src/**/*'), {
                nodir: true
            }),
        }),
        // //拷贝 public文件夹 到 dist 
        // new CopyWebpackPlugin([{
        //     from: path.resolve(__dirname, '../public'),
        //     to: path.resolve(__dirname, '../dist')
        // }]),
        //打包完成后，生成打包分析页面
        // new BundleAnalyzerPlugin({
        //     analyzerMode: 'static'
        // })
    ],
})