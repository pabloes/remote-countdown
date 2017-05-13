module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-nw-builder');
    grunt.initConfig({
        nwjs: {
            options: {
                version: "0.21.0",
                platforms: ['win64', 'win32', 'osx64', 'linux32', 'linux64'],
                buildDir: './webkitbuilds',
                macIcns: './dist/client/time.icns',
                //winIco requires wine to be installed in no windows environment
                //winIco: './dist/client/time.ico',
            },
            src: ['dist/client/**/*']
        }
    });
};