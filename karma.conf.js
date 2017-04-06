
module.exports = function(config) {
    config.set({
        // ... normal karma configuration
        basePath:'',
        files: [
            'src/client/**/*.spec.js'
        ],
        browsers: ['Chrome'],
        preprocessors: {
            "src/client/**/*.js": ['webpack']
        },
        webpack: {
            resolve: {
                extensions: ["", ".js"]
            },
            module: {
                loaders: [
                    { test: /\.js$/,
                        loader: 'babel',
                        query: {
                            plugins: ['transform-runtime'],
                            presets: ['es2015']
                        }
                    }
                ]
            }
        },
        webpackMiddleware: {
            stats: {
                colors: true
            }
        },
        plugins: [
            "karma-chrome-launcher",
            'karma-webpack',
            'karma-jasmine'
        ],
        frameworks:[
            'jasmine'
        ]
    });
};