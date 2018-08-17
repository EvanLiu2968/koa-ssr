# Webpack4 plus koa

> 基于webpack4、koa2构建的 Node项目，集成react, vue和node服务，多页面入口，支持开发、生产多种场景。

目前最新版`webpack4.16.5`可运行
- [https://webpack.js.org](https://webpack.js.org/concepts/)

## 打包构建

- 配置项
实际运行的配置为`config.default.js` + `config.${process.env.APP_ENV}.js`

- 多页面入口
页面入口为`src/page/**/index.js`

html入口为`src/page/**/index.html` 或者 `src/entry/layout.html`

- 自动刷新
客户端代码修改自动编译刷新，服务端代码修改`nodemon`自动重启(需手动刷新，考虑到这属于低频场景)

- 编译优化
`happypack`多进程编译，`webpack-parallel-uglify-plugin`多进程js压缩，使用webpack4的`optimization`模块拆分优化

## Node服务模块

借鉴egg的 `约定优于配置` 设计思想，`app/core`为框架核心，定制了一整套微服务框架规范。
主要目的是实现egg的规范，简化实现过程，详见`app`源码

### Config

- `preMiddleware` 前置中间件
- `postMiddleware` 后置中间件
- `static` 静态资源配置
- `views` 模板配置
- `bodyparser` body解析配置，FormData使用`formidable`解析
- `cors` 跨域资源配置
- `formidable` 上传配置
- `onerror` 500处理
- `notfound` 404处理

约定所有中间件配置参数为config的同名key值，例如：
```javascript
// middleware/logger.js

module.exports = (app) => {
  const { config } = app;
  const option = config.logger

  return async function(ctx, next){
    // handle with logger option
  }
};
```

### Extend

`app/extend`目录下的模块用于扩展ctx对象
调用方式示例：`ctx.validate.isMobile.call(ctx)`

### Middleware

中间件和 Koa 的中间件写法是一模一样的
core里内置了一些常用中间件，并且可以通过配置开启中间件(包括内置中间件)

由于中间件的加载顺序会影响到应用的运行，所以配置增加了`config.preMiddleware`和`config.postMiddleware`,
实际中间件加载顺序为: 

```javascript
config.middleware = config.preMiddleware.concat(config.coreMiddleware).concat(config.postMiddleware)
```

### Controller

控制层，路由逻辑封装

### Service

服务层，服务逻辑封装

## Start

```bash
# install with taobao registry
npm run ii
# 本地开发
npm run dev
# 打包构建
npm run build
# 生产运行
npm run start
```