const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'node_modules/onnxruntime-web/dist/ort-wasm.wasm'),
            to: path.resolve(__dirname, 'public/wasm/ort-wasm.wasm'),
          },
          {
            from: path.resolve(__dirname, 'node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm'),
            to: path.resolve(__dirname, 'public/wasm/ort-wasm-simd.wasm'),
          },
          {
            from: path.resolve(__dirname, 'node_modules/onnxruntime-web/dist/ort-wasm-threaded.wasm'),
            to: path.resolve(__dirname, 'public/wasm/ort-wasm-threaded.wasm'),
          },
        ],
      }),
    ],
  },
  devServer: {
    allowedHosts: 'all',
  },
};
