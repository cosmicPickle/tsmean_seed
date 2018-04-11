const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  })


module.exports = {
    devtool: '#source-map',
    entry: {
        app: [
            './server/src/index.ts',
        ]
    },
    plugins: [],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{ loader: 'ts-loader' }]
            }
        ]
    },
    target: 'node',
    externals: nodeModules
};