const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDev ? "development" : "production",

  entry: {
    vanilla: "./src/vanilla/index.js",
    admin: "./src/admin/admin.js",
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]/bundle.js",
    publicPath: "/",
    clean: true,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
    ],
  },

  plugins: [
    new Dotenv({ systemvars: true }),
    new MiniCssExtractPlugin({
      filename: "[name]/styles.css",
    }),

    // 利用者ページのHTMLを生成 (★ここを修正★)
    new HtmlWebpackPlugin({
      template: "./src/vanilla/index.html",
      filename: "index.html", // dist/index.html として出力
      chunks: ["vanilla"],
    }),

    // 管理ページのHTMLを生成
    new HtmlWebpackPlugin({
      template: "./src/admin/admin.html",
      filename: "admin/index.html", // dist/admin/index.html として出力
      chunks: ["admin"],
    }),

    isDev ? new webpack.HotModuleReplacementPlugin() : () => {},
  ],

  devServer: {
    static: path.join(__dirname, "dist"),
    hot: true,
    port: 3000,
  },

  resolve: {
    fallback: { crypto: false },
  },
};
