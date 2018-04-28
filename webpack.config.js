const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'SlVueTree': './src/sl-vue-tree.vue'
  },
  output: {
    path: __dirname + '/dist',
    filename: 'sl-vue-tree.js',
    library: 'SlVueTree',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },

  devtool: 'sourcemap',


  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },

  externals: {
    'Vue': 'vue'
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: true,
          transformToRequire: {
            video: 'src',
            source: 'src'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp4|ico|wav)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: '[name]-[hash].[ext]',
          outputPath: 'media/',
          publicPath: 'bundles/media/'
        }
      },
      // Handles custom fonts. Currently used for icons.
      {
        test: /\.woff$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts/',
          publicPath: 'bundles/fonts/'
        }
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/*.css', to: '[name].css'},
      { from: 'src/*.d.ts', to: '[name].ts'}
    ])
  ]
};
