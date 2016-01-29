module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodemon: {
            dev: {
                script: 'index.js',
                options: {
                    watch: ['index.js', 'modules/**'],
                    ext: 'js',
                    ignore: ['node_modules/**'],
                    env: {
                        NODE_ENV: 'dev'
                    },
                    nodeArgs: ['--debug'],
                    cwd: __dirname,
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });
                    },
                }
            }
        },
        watch: {
            files: ['*.js', '**/*.js', '*.json', '!node_modules/**', '!.git/**', '!test/**' ],
            tasks: ['jshint']
        },
        jshint: {
            all: ['**/*.js', '**/*.json', '*.json', '!node_modules/**'],
            options: {
                ignore: ['node_modules/**'],
                "esversion": 6,
                "node": true,
                "force": true
            }
        },
        concurrent: {
            options: {
                "logConcurrentOutput": true
            },
            dev: {
                tasks: ['nodemon', 'watch']
            },
            lint: {
                tasks: ['jshint', 'watch']
            }
        },
        simplemocha: {
            options: {
                globals: [], // Add whitelisted globals here
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            },
            all: { src: ['test/**/*.js'] }
        }
    });

    // Load plugins/tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-simple-mocha');

    // Grunt task(s).
    grunt.registerTask('default', ['concurrent:dev']);
    grunt.registerTask('lint', ['concurrent:lint']);
    grunt.registerTask('run', ['nodemon']);
    grunt.registerTask('test', ['simplemocha']);
};