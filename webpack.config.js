const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    assetModuleFilename: 'images/[name][ext]',
    publicPath: '/' // Ensures assets are found correctly
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './Gandi-hub.html',
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      template: './login.html',
      filename: 'login.html'
    }),
    new HtmlWebpackPlugin({
      template: './registration.html',
      filename: 'registration.html'
    }),
    new HtmlWebpackPlugin({
      template: './reviews.html',
      filename: 'reviews.html'
    }),
    new HtmlWebpackPlugin({
      template: './homepage.html',
      filename: 'homepage.html'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    historyApiFallback: {
      // Enable client-side routing
      rewrites: [
        { from: /^\/homepage/, to: '/homepage.html' },
        { from: /^\/login/, to: '/login.html' },
        { from: /^\/registration/, to: '/registration.html' },
        { from: /^\/reviews/, to: '/reviews.html' }
      ]
    },
    compress: true,
    port: 9000,
    hot: true,
    open: true
  }
};