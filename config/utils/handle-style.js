const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV === "production";

// 返回处理样式loader函数
const getStyleLoaders = (pre) => {
    return [
        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
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
module.exports = [
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
]