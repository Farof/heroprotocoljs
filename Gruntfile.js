module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            files: ['*.js', 'bin/*.js', 'examples/*.js', 'lib/*.js', 'test/*.js' ],
            tasks: ['jshint']
        },
        jshint: {
            all: ['*.js', 'bin/*.js', 'examples/*.js', 'lib/*.js', 'test/*.js' ],
            options: {
                esversion: 6,
                node: true,
                force: true
            }
        },
        concurrent: {
            options: {
                "logConcurrentOutput": true
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
    grunt.loadNpmTasks('grunt-simple-mocha');

    // Grunt task(s).
    grunt.registerTask('default', ['concurrent:lint']);
    grunt.registerTask('test', ['simplemocha']);
};