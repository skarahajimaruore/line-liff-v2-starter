const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const env = process.env.NODE_ENV || "production";

const commonConfig = {
  mode: env,

  devServer: {
    static: {
      directory: path.join(__dirname, "src/vanilla"),
      watch: true,
    },
    port: 3000,
  },

  resolve: {
    fallback: {
      crypto: false,
    },
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
          env === "development" ? "style-loader" : MiniCssExtractPlugin.loader,
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

const vanillaConfig = merge(commonConfig, {
  name: "vanilla",
  entry: path.resolve(__dirname, "src/vanilla/index.js"), // ✅ 明示的に絶対パスで指定
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.bundle.js",
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/vanilla/index.html"), // ✅ こちらも同様
    }),
  ],
});

module.exports = [vanillaConfig];
