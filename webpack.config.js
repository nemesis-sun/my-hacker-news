var path = require('path');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');


var commonConfig = {
    devtool: 'eval',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            "Promise": "es6-promise",
            "fetch": "imports?this=>global!exports?global.fetch!whatwg-fetch"
        })
    ],
    module: {
        loaders: [{
                test: /\.js$/,
                loaders: ['react-hot', 'babel'],
                exclude: /node_modules/,
                include: __dirname
            },
            // {
            //   test: /\.css?$/,
            //   loader: 'style-loader!css-loader',
            //   //exclude: /node_modules/,
            //   include: __dirname
            // }
        ]
    }
}

var clientConfig = {
    entry: './src/js/index',
    output: {
        path: path.join(__dirname, "public", "js"),
        filename: 'bundle.js'
    },
    devtool: commonConfig.devtool,
    plugins: commonConfig.plugins,
    module: commonConfig.module
}

var serverConfig = {
    entry: './prod-server.js',
    output: {
        path: __dirname,
        filename: 'prod-server-compiled.js'
    },
    devtool: commonConfig.devtool,
    plugins: commonConfig.plugins,
    module: commonConfig.module,
    target: 'node',
    externals: [nodeExternals()]
}

module.exports = [serverConfig, clientConfig];
