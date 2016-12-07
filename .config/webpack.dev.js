var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

const BUILD_DIR =  helpers.root('build');

module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',

    output: {
        path: BUILD_DIR,
        publicPath: 'http://localhost:3000/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        new ExtractTextPlugin('[name].css'),
		new CopyWebpackPlugin([{ from: 'src/img', to: 'img' }]) //this should point to a static assets folder
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
});