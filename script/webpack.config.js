const NodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const env = require('./env');
const { EnvironmentPlugin } = require('webpack');

module.exports = {
  entry: {
    index: './server/index.ts',
  },
  mode: 'production',
  target: 'node16.10',
  devtool: 'source-map',
  externalsPresets: { node: true },
  externals: [NodeExternals({})],
  resolve: {
    extensions: ['.js', '.ts', 'mjs', '.json', '.wasm', '.cjs'],
    plugins: [new TsconfigPathsPlugin()],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(process.env.DEST, process.env.SERVER_DEST),
  },
  node: {
    __filename: false,
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|cjs|mjs)$/,
        loader: 'esbuild-loader',
        exclude: [/node_modules/],
        options: {
          loader: 'js', // Remove this if you're not using JSX
          target: 'es2015', // Syntax to compile to (see options below for possible values)
          tsconfigRaw: require('../tsconfig.server.json'),
        },
      },
      {
        test: /\.ts$/,
        loader: 'esbuild-loader',
        exclude: [/node_modules/],
        options: {
          loader: 'ts', // Or 'ts' if you don't need tsx
          target: 'es2015',
          tsconfigRaw: require('../tsconfig.server.json'),
        },
      },
    ],
  },
  plugins: [new EnvironmentPlugin(Object.keys(env))],
  optimization: {
    splitChunks: {
      chunks: 'all',
      // 默认值是20000Byte，表示大于这个大小的引入文件都需要抽离出来
      minSize: 10000,
      // 表示的是大于多少字节的包需要进行二次拆分，拆分为不小于minSize的包
      // 多数情况下，如果设置maxSize的值的时候，minSize和maxSize的值一般是一致的
      maxSize: 10000,
      // 某一个包引入了多少次就需要被抽离出来
      minChunks: 1,

      // cacheGroups的含义是 所有的模块输出，会存放在缓存中，最后一起执行对应的操作
      // 在这个属性里面可以自己自定义的代码分割配置
      // cacheGroups的优先级小于minSize和maxSize，所以当两种冲突的时候，cacheGroup中的配置会默认失效
      cacheGroups: {
        // key可以任意取，在这边只是一个占位符
        // value是一个配置对象
        vendor: {
          // 正则，用以匹配对应的模块路径
          test: /[\\/]node_modules[\\/]/,
          // 输出文件名 输出文件会以 输出文件名-hash值.js的形式输出
          // name: "vender",

          // filename 输出文件名，和name不同的是，filename中可以使用placeholder
          filename: 'vendor_[id].js',
          // 优先级 在这个配置中约定俗称，一般设置为负数
          priority: -10
        },
        default: {
          minChunks: 2,
          filename: "common_[id].js",
          priority: -20
        }
      }
    }
  }

};
