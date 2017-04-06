var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin('stylesheets/[name].css');

module.exports = {
    context: __dirname + "",
    entry: [
        "./src/client/main.js",
        "./src/client/main.scss"],
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
            }
        ]
    },
    plugins:[
        extractCSS
    ],
    devServer:{
        contentBase:'dist/client/'
    }
};