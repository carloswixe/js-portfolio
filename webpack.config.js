const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/images/[hash][ext][query]'
  },
  resolve: {
    extensions: ['.js'],
    alias:{
        '@utils':path.resolve(__dirname,'src/utils/'),
        '@templates':path.resolve(__dirname,'src/templates/'),
        '@styles':path.resolve(__dirname,'src/styles/'),
        '@images':path.resolve(__dirname,'src/assets/images/')
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/fonts/[hash][ext]",
        },
      },
      {
        test: /\.css|.styl$/i,
        use: [MiniCssExtractPlugin.loader,
          'css-loader',
          'stylus-loader'
        ],
      },
      {
        test: /\.png/,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        // type: 'asset/resource',
        use: {
            loader: 'url-loader', // NOMBRE DEL LOADER
            options: {
                limit: false, // O LE PASAMOS UN NUMERO, Habilita o deshabilita la transformación de archivos en base64.
                mimetype: 'aplication/font-woff', //  nos permite determinar el tipo de archivo que será enlazado o cargado
                // Los MIME Types (Multipurpose Internet Mail Extensions), son la manera standard de mandar contenido a través de la red.
                name: '[name].[ext]', // EL NOMBRE INICIAL DEL PROYECTO + SU EXTENSIÓN, PUEDES AGREGARLE [name]hola.[ext] y el output del archivo seria ubuntu-regularhola.woff
                outputPath: './assets/fonts/', 
                publicPath: '../assets/fonts/',
                esModule: false
            }
        }
    },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './public/index.html',
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src", "assets/images"),
          to: "assets/images"
        }
      ]
    }),
    new Dotenv(),
    new CleanWebpackPlugin()

  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ]
  }
}