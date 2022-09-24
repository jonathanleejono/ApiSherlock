const nodeExternals = require("webpack-node-externals");
const path = require("path");

module.exports = {
  entry: "./src/server.ts",
  target: "node",
  externals: [nodeExternals()],
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      constants: path.resolve(__dirname, "src/constants"),
      controllers: path.resolve(__dirname, "src/controllers"),
      db: path.resolve(__dirname, "src/db"),
      enum: path.resolve(__dirname, "src/enum"),
      errors: path.resolve(__dirname, "src/errors"),
      interfaces: path.resolve(__dirname, "src/interfaces"),
      middleware: path.resolve(__dirname, "src/middleware"),
      mocks: path.resolve(__dirname, "src/mocks"),
      models: path.resolve(__dirname, "src/models"),
      routes: path.resolve(__dirname, "src/routes"),
      test: path.resolve(__dirname, "src/test"),
      types: path.resolve(__dirname, "src/types"),
      utils: path.resolve(__dirname, "src/utils"),
      validator: path.resolve(__dirname, "src/validator"),
    },
    modules: ["src"],
    extensions: [".ts", ".js"],
  },
  stats: { errorDetails: true },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "output"),
  },
};
