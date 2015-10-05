module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        mochaTest: {
            src: ['src/*.spec.js'],
            options: {
                reporter: 'spec'
            }
        }
    });

};