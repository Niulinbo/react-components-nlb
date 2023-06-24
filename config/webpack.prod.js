const path = require("path");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const nodeExternals = require('webpack-node-externals')

// 返回处理样式loader函数
const getStyleLoaders = (pre) => {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      // 处理css兼容性问题
      // 配合package.json中browserslist来指定兼容性
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["postcss-preset-env"],
        },
      },
    },
    pre && {
      loader: pre,
      options:
        pre === "less-loader"
          ? {
            // antd自定义主题配置
            // 主题色文档：https://ant.design/docs/react/customize-theme-cn#Ant-Design-%E7%9A%84%E6%A0%B7%E5%BC%8F%E5%8F%98%E9%87%8F
            lessOptions: {
              modifyVars: { "@primary-color": "#1DA57A" },
              javascriptEnabled: true,
            },
          }
          : {},
    },
  ].filter(Boolean);
};

module.exports = {
  entry: {
    About: './src/pages/About',
    Home: './src/pages/Home'
  },
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
      // 处理css
      {
        test: /\.css$/,
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/,
        use: getStyleLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoaders("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders("stylus-loader"),
      },
      // 处理图片
      {
        test: /\.(jpe?g|png|gif|webp|svg)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      // 处理其他资源
      {
        test: /\.(woff2?|ttf)$/,
        type: "asset/resource",
      },
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
