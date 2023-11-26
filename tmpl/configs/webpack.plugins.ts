/* eslint-disable @typescript-eslint/no-var-requires */
import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import type { WebpackPluginInstance } from 'webpack';
import webpack from 'webpack';

import { resolveApp } from './utils';
import { isDevelopment } from './webpack.env';

const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const plugins: WebpackPluginInstance[] = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }),
];

if (isDevelopment) {
  plugins.push(
    new ForkTsCheckerWebpackPlugin({
      async: true,
      formatter: 'codeframe',
      logger: 'webpack-infrastructure',
      typescript: {
        configFile: resolveApp('./tsconfig.json'),
        mode: 'write-references',
        typescriptPath: require.resolve('typescript'),
        configOverwrite: {},
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
      devServer: false,
    }),
  );
}

export { plugins };
