// webpack.config.js
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

const env = process.env.NODE_ENV || "production";

module.exports = {
  mode: env,

  entry: path.resolve(__dirname, "src/vanilla/index.js"),

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.bundle.js",
    publicPath: "/",
  },

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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/vanilla/index.html"),
    }),
  ],
};
