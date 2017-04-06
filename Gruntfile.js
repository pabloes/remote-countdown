module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-nw-builder');
    grunt.initConfig({
        nwjs: {
            options: {
                "version": "0.12.0",
                platforms: ['win64', 'win32', 'osx64', 'linux32', 'linux64'],
                buildDir: './webkitbuilds' // Where the build version of my NW.js app is saved
            },
            src: ['dist/client/**/*']
        }
    });
};