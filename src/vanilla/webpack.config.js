const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // どのJSファイルをビルドの起点にするか設定
  entry: {
    main: "./src/index.js", // 利用者ページのJS
    admin: "./src/admin/admin.js", // 管理ページのJS
  },

  // ビルド結果をどのフォルダに、どういう名前で出力するか設定
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js", // main.bundle.js と admin.bundle.js が生成される
    clean: true, // ビルド前にdistフォルダを綺麗にする
  },

  module: {
    // JSファイルやCSSファイルをどう処理するか設定
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  // プラグインの設定
  plugins: [
    // 1. 利用者ページ用のHTMLを生成
    new HtmlWebpackPlugin({
      template: "./src/index.html", // テンプレートとなるHTML
      filename: "index.html", // 出力されるファイル名
      chunks: ["main"], // 読み込むJSファイル (main.bundle.js)
    }),
    // 2. 管理ページ用のHTMLを生成
    new HtmlWebpackPlugin({
      template: "./src/admin/admin.html", // テンプレートとなるHTML
      filename: "admin.html", // 出力されるファイル名
      chunks: ["admin"], // 読み込むJSファイル (admin.bundle.js)
    }),
  ],

  // 開発用サーバーの設定
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
  },
};
