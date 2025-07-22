const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",

  // 利用者アプリのJSファイルのみをエントリーポイントに設定
  entry: "./src/vanilla/index.js",

  // 出力設定をシンプルに
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true, // ビルド前にdistフォルダを空にする
  },

  // 各種ファイルの処理ルール
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },

  // プラグイン設定
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
    }),

    // 利用者ページのHTML生成設定のみを残す
    new HtmlWebpackPlugin({
      template: "./src/vanilla/index.html",
      filename: "index.html",
    }),
  ],

  // 開発用サーバー
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
};
