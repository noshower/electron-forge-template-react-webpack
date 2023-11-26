import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { Configuration } from 'webpack';

import { isDevelopment, isProduction } from './webpack.env';
import { optimization } from './webpack.optimization';
import { plugins } from './webpack.plugins';
import { rules } from './webpack.rules';

rules.push({
  test: /\.less$/,
  use: [
    isProduction
      ? {
          loader: MiniCssExtractPlugin.loader,
        }
      : {
          loader: require.resolve('style-loader'),
        },
    {
      loader: require.resolve('css-loader'),
      options: {
        esModule: true,
        sourceMap: isDevelopment,
        modules: {
          localIdentName: '[local]_[hash:base64:5]',
        },
      },
    },
    {
      loader: require.resolve('less-loader'),
      options: {
        sourceMap: true,
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  ],
  sideEffects: true,
});

rules.push({
  test: /\.(png|jpg|jpeg|gif|svg)/i,
  type: 'asset',
});

if (isProduction) {
  plugins.push(
    new MiniCssExtractPlugin({
      ignoreOrder: true,
    }),
  );
}

export const rendererConfig: Configuration = {
  devtool: isProduction ? false : 'eval-cheap-module-source-map',
  module: {
    rules,
  },
  optimization: isProduction ? optimization : undefined,
  plugins,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.less'],
  },
};
