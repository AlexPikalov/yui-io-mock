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
        },
        uglify: {
            dist: {
                options: {
                    sourceMap: true,
                    sourceMapName: 'yui-io-mock.map'
                },
                files: {
                    'yui-io-mock.min.js': ['yui-io-mock.js']
                }
            }
        }
    });

//    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
};