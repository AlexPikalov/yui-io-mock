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
        },
        shell: {
            'git.add-files': {
                command: 'git add .'
            },
            'git.commit': {
                command: function (message) {
                    console.log('Creating commit... ', 'git commit -m ' + message);
                    return 'git commit -m ' + message;
                }
            },
            'git.tag': {
                command: function (tag) {
                    return 'git tag ' + tag;
                }
            },
            'git.tag-push': {
                command: function (tag) {
                    return 'git push origin ' + tag
                }
            }
        }
//        replace: {
//            'version-bower': {
//
//            },
//            'version-sourcecode': {
//
//            },
//            'version-packagefile': {
//
//            }
//        }
    });

    grunt.registerTask('set-version', []);

        grunt.registerTask('commit', function (message) {
            grunt.task.run('uglify:dist');
            grunt.task.run('shell:git.add-files');
            console.log('message', message);
            grunt.task.run('shell:git.commit:"' + message + '"');
        });

//        grunt.registerTask('release', function (version) {
//            grunt.task.run('replace:version-bower:<%= version %>');
//            grunt.task.run('replace:version-sourcecode:<%= version %>');
//            grunt.task.run('replace:version-packagefile:<%= version %>');
//            grunt.task.run('shell:git.tag:"v<%= verion %>"');
//            grunt.task.run('shell:git.tag-push:"v<%= verion %>"');
//        });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-text-replace');
};
