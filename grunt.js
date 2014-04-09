/*globals module */

module.exports = function(grunt) {

    /**
     * Define our Grunt configuration.
     */
    grunt.initConfig({

        /**
         * Define the validation options to apply.
         * See: http://www.jshint.com/docs/
         */
        jshint: {
            options: {
                browser: true,
                curly: true,
                eqnull: true,
                immed: true,
                jquery: true,
                newcap: true,
                noarg: true,
                smarttabs: true,
                sub: true,
                undef: true,
                unused: true
            }
        },

        /**
         * Define the files we'll validate.
         */
        lint: {
            all: ['grunt.js',
                'src/jquery.txtTruncate.js']
        },

        /**
         * Compress the plugin.
         */
        min: {
            plugin: {
                src: 'src/jquery.txtTruncate.js',
                dest: 'src/jquery.txtTruncate.min.js'
            }
        },

        /**
         * Allow Grunt to run by itself.
         */
        watch: {
            scripts: {
                files: '<config:lint.all>',
                tasks: 'lint'
            }
        }
    });

    // By default, just run lint.
    grunt.registerTask('default', 'lint');
};