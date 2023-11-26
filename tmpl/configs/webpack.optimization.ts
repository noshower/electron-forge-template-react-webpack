import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import type { Configuration } from 'webpack';

import { isProduction } from './webpack.env';

const minimize: Configuration['optimization'] = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      minify: TerserPlugin.esbuildMinify,
      terserOptions: {
        // 不加这个配置，esbuild 会在压缩代码时，会优化代码。https://esbuild.github.io/api/#minify
        // @ts-ignore
        target: 'es6',
      },
      extractComments: false,
      parallel: true,
    }),
    new CssMinimizerWebpackPlugin({
      minify: CssMinimizerWebpackPlugin.esbuildMinify,
      parallel: true,
      minimizerOptions: {
        // esbuild 默认情况下会优化 css 代码，将部分代码优化为更简洁的现代代码，导致 chrome 86 以下浏览器，样式有问题
        // @ts-ignore
        target: 'chrome100',
      },
    }),
  ],
};

export const optimization: Configuration['optimization'] = {
  splitChunks: {
    cacheGroups: {
      vendors: {
        name: 'chunk-vendors',
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        chunks: 'initial',
      },
      common: {
        name: 'chunk-common',
        minChunks: 2,
        priority: -20,
        chunks: 'initial',
        reuseExistingChunk: true,
      },
    },
  },
  runtimeChunk: {
    name: 'runtime',
  },
  ...(isProduction ? minimize : {}),
};
