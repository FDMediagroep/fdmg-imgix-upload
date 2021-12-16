const webpack = require("webpack");
const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const NODE_ENV = JSON.stringify(
  process.env.NODE_ENV ? process.env.NODE_ENV : "development"
);
const devtool = NODE_ENV == '"development"' ? "source-map" : undefined;

module.exports = {
  target: "node",
  devtool,
  // experiments: {
  //     outputModule: true,
  // },
  optimization: {
    minimize: true,
  },
  entry: {
    app: ["./src/app.ts"],
  },
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    libraryTarget: "commonjs2",
    publicPath: "",
    clean: true,
    // module: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "../analyzer/lib.html",
      openAnalyzer: false,
    }),
  ],
  externals: {},
  module: {
    strictExportPresence: true,
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by a TypeScript loader
      {
        test: /\.(ts|tsx|js|jsx)$/,
        include: [path.resolve(__dirname, "src")],
        loader: "ts-loader",
      },
    ],
  },
};
