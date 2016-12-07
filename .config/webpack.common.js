var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var helpers = require('./helpers');

const APP_DIR = helpers.root('src', 'app');

module.exports = {

    //Application entypoints, these will be individually bundled
    entry: {
        'polyfills': './src/inc/polyfills.ts',
        'vendor': './src/inc/vendor.ts',
        'app': './src/app/main.ts'
    },
    resolve: {
        extensions: ['','.js', '.ts']
    },
    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                loader: 'tslint'
            }
        ],
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=img/[name].[hash].[ext]'
            },
            {
                test: /\.css$/,
                exclude: APP_DIR,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            },
            {
                test: /\.css$/,
                include: APP_DIR,
                loaders: ['css-to-string-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                exclude: APP_DIR,
                loaders: ['style', 'css', 'sass']
            },
            {
                test: /\.scss$/,
                include: APP_DIR,
                loaders: ['css-to-string-loader', 'css-loader', 'sass-loader']
            }

        ]
    },
    tslint: {
        emitErrors: true,
        failOnHint: true,
        configuration: './.config/tslint.json'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
		
		new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
       })
    ]
};