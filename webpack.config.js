const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDev ? "development" : "production",

  // 複数エントリーポイントの設定
  entry: {
    vanilla: "./src/vanilla/index.js",
    admin: "./src/admin/admin.js",
  },

  // ★出力先をdistフォルダ1つに統一★
  output: {
    path: path.resolve(__dirname, "dist"),
    // JSファイル名にディレクトリパスを含める
    filename: "[name]/bundle.js",
    publicPath: "/",
    clean: true, // ビルド前にdistをクリーンアップ
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
      // CSSファイル名にディレクトリパスを含める
      filename: "[name]/styles.css",
    }),

    // 利用者ページのHTMLを生成
    new HtmlWebpackPlugin({
      template: "./src/vanilla/index.html",
      // 出力先をvanillaフォルダに指定
      filename: "vanilla/index.html",
      chunks: ["vanilla"], // vanillaのJSとCSSのみ読み込む
    }),

    // 管理ページのHTMLを生成
    new HtmlWebpackPlugin({
      template: "./src/admin/admin.html",
      // 出力先をadminフォルダに指定
      filename: "admin/index.html",
      chunks: ["admin"], // adminのJSとCSSのみ読み込む
    }),

    // 開発サーバー用の設定
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
