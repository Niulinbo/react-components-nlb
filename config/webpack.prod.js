// utils
const styleLoaders = require('./utils/handle-style')
const componentsEntry = require('./utils/getEntry')

const path = require("path");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const nodeExternals = require('webpack-node-externals')

module.exports = {
  // entry: {
  //   About: './src/module/About',
  //   Home: './src/module/Home'
  // },
  entry: componentsEntry,
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: '[name]/index.js',
    libraryTarget: 'umd',
    library: '[name]',
    libraryExport: "default",
    clean: true,
  },
  module: {
    rules: [
      ...styleLoaders,
      // 处理js
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "../src"),
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          cacheCompression: false,
        },
      },
    ],
  },
  // 处理html
  plugins: [
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules",
      cache: true,
      cacheLocation: path.resolve(__dirname, "../node_modules/.cache/.eslintcache"),
    }),
    new MiniCssExtractPlugin({
      filename: '[name]/style/index.css',
    }),
  ],
  mode: "production",
  devtool: "source-map",
  externals: [nodeExternals()],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerWebpackPlugin(),
      new TerserWebpackPlugin(),
    ],
  },
  // webpack解析模块加载选项
  resolve: {
    // 自动补全文件扩展名
    extensions: [".jsx", ".js", ".json"],
  },
};
