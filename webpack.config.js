const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",

  // エントリーポイント（入力ファイル）
  entry: {
    // 利用者ページ用JS
    main: "./src/vanilla/index.js",
    // 管理ページ用JS
    admin: "./src/admin/admin.js",
  },

  // 出力設定
  output: {
    path: path.resolve(__dirname, "dist"),
    // 出力ファイル名 [name]にはentryのキーが入る (main, admin)
    filename: "[name]/bundle.js",
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
      filename: "[name]/styles.css",
    }),

    // 利用者ページのHTMLを生成 (`dist/index.html`)
    new HtmlWebpackPlugin({
      template: "./src/vanilla/index.html",
      filename: "index.html",
      chunks: ["main"], // mainのJSとCSSだけを読み込む
    }),

    // 管理ページのHTMLを生成 (`dist/admin/index.html`)
    new HtmlWebpackPlugin({
      template: "./src/admin/admin.html",
      filename: "admin/index.html",
      chunks: ["admin"], // adminのJSとCSSだけを読み込む
    }),
  ],

  // 開発用サーバー（Vercelのデプロイには影響なし）
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
};
