module.exports = {
  presets: [
    ['@babel/preset-env',
      {
        "useBuiltIns": "usage", //使用的api 会自动转化,并且是按需加载
        "corejs": 2
      }
    ]
  ],
  plugins: [
    //解析装饰器
    // ["@babel/plugin-proposal-decorators", {
    //   "legacy": true
    // }],
    //解析类的属性
    ["@babel/plugin-proposal-class-properties", {
      "loose": true
    }],
    ["@babel/plugin-transform-runtime"],
    //路由懒加载
    // ['@babel/plugin-syntax-dynamic-import']
  ]
}