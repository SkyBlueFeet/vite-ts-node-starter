# vite-ts-node-starter

## Feature

- 集成typescript, node, vite, vue3的一体化开发范式，支持log4js
- `server`目录为express项目,支持开发时文件监控（仅监控server目录）
- `client`目录为vue3项目,开发时使用vite工具进行热更新
- node服务端使用`webpack`打包，开发时使用ts-node执行，支持tsconfig.json`paths`

## Why
适用于前后端都使用ts开发的项目，前后端分离，适合小型、人少的项目，开发前和开发后都可以使用一条命令直接启动项目

## Usage
### 开发环境
```js
npm run dev // 开发环境下执行命令打开开发服务器
npm run build // 打包命令
npm run preview // 打包完成后检查生成
```
### 生产环境
打包完成后，会生成一个带有package.json文件的文件夹（默认是`dest`）。将此文件夹内的内容放置到服务器目录中，并`安装依赖`。该环境下package.json提供了以下命令
```js
npm run start // 生产环境下执行程序
npm run stop // 生产环境下停止程序
npm run restart // 生产环境下重启程序
```


## Tips
- 打包后的`dest`目录可以复制到任何地方执行
- 尽量将运行时使用的依赖放到package.json中的dependencies,因为build时会删除devDependencies,即生产环境中不会安装因为build时会删除devDependencies下的依赖，如有其他需求请修改`script/build.js`。
- 生产环境下使用pm2执行程序，你可以在生成目录下的pm2.config.json文件中查看或修改配置文件


## Reference

[ts-koa-starter](https://github.com/Vibing/ts-koa-starter)
[vite](https://vitejs.dev/)
