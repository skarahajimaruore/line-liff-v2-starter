const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const env = process.env.NODE_ENV || "production";
const isDev = env === "development";

// 共通設定
const common = {
  mode: env,
  resolve: {
    fallback: { crypto: false },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
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
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
};

// ── 利用者アプリ（vanilla）設定 ──
const vanillaConfig = {
  ...common,
  name: "vanilla",
  entry: path.resolve(__dirname, "src/vanilla/index.js"),
  output: {
    path: path.resolve(__dirname, "dist/vanilla"),
    filename: "bundle.js",
    publicPath: "/vanilla/",
  },
  plugins: [
    ...common.plugins,
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/vanilla/index.html"),
      filename: "index.html",
    }),
  ],
  // ローカル開発用サーバーは vanilla のみ
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist/vanilla"),
      watch: true,
    },
    port: 3000,
    hot: true,
  },
};

// ── 管理画面アプリ（admin）設定 ──
const adminConfig = {
  ...common,
  name: "admin",
  entry: path.resolve(__dirname, "src/admin/admin.js"),
  output: {
    path: path.resolve(__dirname, "dist/admin"),
    filename: "bundle.js",
    publicPath: "/admin/",
  },
  plugins: [
    ...common.plugins,
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/admin/admin.html"),
      filename: "index.html",
    }),
  ],
  // 管理画面も devServer で動かしたい場合はポートを変えるなど調整してください
};

module.exports = [vanillaConfig, adminConfig];
