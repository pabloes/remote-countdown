var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin('stylesheets/[name].css');
var argv = require('yargs').argv;
var webpack = require('webpack');
console.log(argv);
module.exports = {
    context: __dirname + "",
    entry: [
        "./src/client/main.js",
        "./src/client/main.scss",
        "./src/client/img/icons/icons.js"
    ],
    output: {
        path: __dirname + "/dist/client",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    plugins: ['transform-runtime'],
                    presets: ['es2015']
                },
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                loader: extractCSS.extract(['css','sass']),
                exclude: /node_modules/
            },
            {
                test: /\.woff2$/,
                loader: 'url',
                exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                loader: 'file?name=img/icons/[name].[ext]',
                exclude: /node_modules/
            },
              {
                test: /\.tpl\.html$/, // Only .html files
                loader: 'html' // Run html loader
              }
        ]
    },
    plugins:[
        extractCSS,
          new webpack.DefinePlugin({
            WEBPACK: {
                PRODUCTION:JSON.stringify(argv.dev !== undefined?false:true)
            }
          })
    ],
    devServer:{
        contentBase:'dist/client/'
    }
};