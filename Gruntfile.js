module.exports = function (grunt) {
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    base: ['src'],
                    keepalive: true,
                    open: 'http://localhost:8000'
                }
            },
            yui: {
                options: {
                    keepalive: true,
                    open: 'http://localhost:8000'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
};