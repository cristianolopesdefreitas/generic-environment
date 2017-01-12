module.exports = function( grunt ) {
    'use strict';

    grunt.initConfig({
        appConfig: {
            dev: {
                base: 'dev',
                css: 'dev/css',
                fonts: 'dev/fonts',
                images: 'dev/images',
                js: 'dev/js',
                pages: 'dev/pages',
                includes: 'dev/includes'
            },
            dist: {
                base: 'dist',
                css: 'dist/css',
                fonts: 'dist/fonts',
                images: 'dist/images',
                js: 'dist/js'
            },
            vendorJS: [],
            baseJS: [],
            vendorCSS: [],
            mainSCSS: '<%= appConfig.dev.css %>/main.scss',
            buildedCSS: '<%= appConfig.dev.css %>/styles.css',
            bowerFonts: [],
            includes: [
                // html includes
                '<%= appConfig.dev.includes %>/header.html',
                '<%= appConfig.dev.includes %>/footer.html'
            ],
            pages: [
                // html pages
                '<%= appConfig.dev.pages %>/index.html'
            ],
            watchFiles: [ 'Gruntfile.js' ].concat(
                '<%= appConfig.dev.css %>/**/*.scss',
                '<%= appConfig.baseJS %>',
                '<%= appConfig.includes %>',
                '<%= appConfig.pages %>'
            )
        }, // appConfig

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            target: [ 'Gruntfile.js' ].concat(
                '<%= appConfig.baseJS %>'
            )
        }, // jshint

        uglify: {
            options: {
                preserveComments: false
            },
            dist: {
                files: {
                    '<%= appConfig.dist.js %>/scripts.js': [].concat(
                        '<%= appConfig.vendorJS %>',
                        '<%= appConfig.baseJS %>'
                    )
                }
            }
        }, // uglify

        sass: {
            dist: {
                options: {
                    sourcemap: 'none'
                },
                files: {
                    '<%= appConfig.buildedCSS %>': '<%= appConfig.mainSCSS %>'
                }
            },
            dev: {
                options: {
                    sourcemap: 'none',
                    style: 'expanded'
                },
                files: {
                    '<%= appConfig.buildedCSS %>': '<%= appConfig.mainSCSS %>'
                }
            }
        }, // sass

        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            dist: {
                files: {
                    '<%= appConfig.dist.css %>/styles.css': [].concat(
                        '<%= appConfig.vendorCSS %>',
                        '<%= appConfig.buildedCSS %>'
                    )
                }
            }
        }, // cssmin

        copy: {
            dist: {
                files:  [
                    {
                        expand: true,
                        cwd: '<%= appConfig.bowerFonts %>',
                        dest: '<%= appConfig.dist.fonts %>/',
                        src: [ '*' ]
                    },
                    {
                        expand: true,
                        cwd: '<%= appConfig.dev.images %>',
                        dest: '<%= appConfig.dist.images %>/',
                        src: [ '*' ]
                    }
                ]
            },
            dev: {
                files:  [
                    {
                        expand: true,
                        cwd: '<%= appConfig.bowerFonts %>',
                        dest: '<%= appConfig.dev.fonts %>/',
                        src: [ '*' ]
                    }
                ]
            }
        }, // copy

        concat: {
            css: {
                files: {
                    '<%= appConfig.dev.css %>/styles.css':  [].concat(
                        '<%= appConfig.vendorCSS %>',
                        '<%= appConfig.buildedCSS %>'
                    )
                }
            },
            js: {
                files: {
                    '<%= appConfig.dev.js %>/scripts.js': [].concat(
                        '<%= appConfig.vendorJS %>',
                        '<%= appConfig.baseJS %>'
                    )
                }
            }
        }, // concat

        includes: {
            dist: {
                cwd: '<%= appConfig.dev.pages %>',
                dest: '<%= appConfig.dist.base %>',
                src: [ '*.html' ],
                options: {
                    flatten: true,
                    includePath: '<%= appConfig.dev.includes %>'
                }
            },
            dev: {
                cwd: '<%= appConfig.dev.pages %>',
                dest: '<%= appConfig.dev.base %>',
                src: [ '*.html' ],
                options: {
                    flatten: true,
                    includePath: '<%= appConfig.dev.includes %>'
                }
            },
        }, // includes

        strip_code: {
            options: {
                blocks: [
                    {
                        start_block: '<!-- start-livereload-script -->',
                        end_block: '<!-- end-livereload-script -->'
                    }
                ]
            },
            strip: {
                src: '<%= appConfig.dist.base %>/*.html'
            }
        }, // strip code

        connect: {
            server: {
                options: {
                    port: 9000,
                    hostname: '*',
                    open: 'http://localhost:9000/',
                    base: '<%= appConfig.dev.base %>'
                }
            }
        }, // connect

        watch: {
            dev: {
                files: '<%= appConfig.watchFiles %>',
                tasks: [ 'jshint', 'sass:dev', 'concat:css', 'concat:js', 'includes:dev' ],
                options: {
                    livereload: true
                }
            }
        } // watch
    });

    grunt.registerTask( 'default', function() {
        grunt.task.run([ 'dev' ]);
    });

    grunt.registerTask( 'dev', function() {
        grunt.task.run([
            'jshint',
            'sass:dev',
            'concat:css',
            'concat:js',
            'includes:dev',
            'copy:dev',
            'connect',
            'watch:dev'
        ]);
    });

    grunt.registerTask( 'dist', function() {
        grunt.task.run([
            'jshint',
            'uglify:dist',
            'sass:dist',
            'cssmin:dist',
            'includes:dist',
            'strip_code',
            'copy:dist'
        ]);
    });

    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-sass' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-includes' );
    grunt.loadNpmTasks( 'grunt-strip-code' );
    grunt.loadNpmTasks( 'grunt-contrib-connect' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
};
