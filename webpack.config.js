// webpack.config.js
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  // 開発／本番モード切り替え
  mode: isDev ? "development" : "production",

  // ① マルチエントリポイント定義
  entry: {
    // 利用者アプリ側
    main: path.resolve(__dirname, "src/vanilla/index.js"),
    // 管理画面側
    admin: path.resolve(__dirname, "src/admin/admin.js"),
  },

  // 出力設定
  output: {
    path: path.resolve(__dirname, "dist"),
    // dist/main/bundle.js, dist/admin/bundle.js と出力される
    filename: "[name]/bundle.js",
    // HTML から相対パスで参照できるように
    publicPath: "./",
  },

  module: {
    rules: [
      // CSS ローダー
      {
        test: /\.css$/,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
      // JS/JSX → Babel でトランスパイル
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },

  plugins: [
    // CSS を separate file に抽出
    new MiniCssExtractPlugin({
      // dist/main/styles.css, dist/admin/styles.css
      filename: "[name]/styles.css",
    }),

    // ② 利用者画面用 HTML を吐き出す
    new HtmlWebpackPlugin({
      filename: "index.html", // 出力先
      template: path.resolve(__dirname, "src/vanilla/index.html"), // テンプレートだ
      chunks: ["main"], // これらの JS/CSS を埋め込む
    }),

    // ③ 管理画面用 HTML を吐き出す
    new HtmlWebpackPlugin({
      filename: "admin/index.html",
      template: path.resolve(__dirname, "src/admin/admin.html"),
      chunks: ["admin"],
    }),
  ],

  // ローカル開発用サーバー
  devServer: {
    static: path.resolve(__dirname, "dist"),
    hot: true,
    port: 3000,
  },
};
