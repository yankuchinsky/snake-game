const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const baseConfig = {
  entry: "./src/index.ts",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.png$/,
        use: "file-loader",
      },
    ],
  },
};

const prodConfig = {
  ...baseConfig,
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
};

const devConfig = {
  ...baseConfig,
  mode: "development",
  devServer: {
    contentBase: "./dist",
    hot: true,
  },
  output: {
    path: path.join(__dirname, "/dev"),
    filename: "index.bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new webpack.SourceMapDevToolPlugin({}),
  ],
  devtool: "inline-source-map",
};

const isProduction = process.env.NODE_ENV === "production";

module.exports = isProduction ? prodConfig : devConfig;
