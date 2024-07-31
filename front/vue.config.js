const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(
              __dirname,
              "node_modules/onnxruntime-web/dist/ort-wasm.wasm"
            ),
            to: path.resolve(__dirname, "dist/ort-wasm.wasm"),
          },
          {
            from: path.resolve(
              __dirname,
              "node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm"
            ),
            to: path.resolve(__dirname, "dist/ort-wasm-simd.wasm"),
          },
          {
            from: path.resolve(
              __dirname,
              "node_modules/onnxruntime-web/dist/ort-wasm-threaded.wasm"
            ),
            to: path.resolve(__dirname, "dist/ort-wasm-threaded.wasm"),
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.wasm$/,
          type: "javascript/auto",
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "wasm",
                publicPath: "/wasm/",
              },
            },
          ],
        },
      ],
    },
  },
  devServer: {
    allowedHosts: "all",
  },
};
