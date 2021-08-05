const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const instanceOfMiniCssExtractPlugin = webpackConfig.plugins.find(
        (plugin) => plugin instanceof MiniCssExtractPlugin
      );
      instanceOfMiniCssExtractPlugin.options.ignoreOrder = true;
      return webpackConfig;
    },
  },
};
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// module.exports = {
//   plugins: [new MiniCssExtractPlugin()],
//   module: {
//     rules: [
//       {
//         test: /\.css$/i,
//         use: [MiniCssExtractPlugin.loader, 'css-loader'],
//       },
//     ],
//   },
// };
