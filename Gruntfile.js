'use strict';
var path = require('path');
var scripts = ['bin/*.js', 'lib/*.js', 'tests/unit/*.js', 'tests/e2e/**/*.js']
module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    /**
     * Construct glob to files.
     * @param {String} dir
     * @param {String} ext
     */
    pkg.glob = function(dir, ext) {
        return path.join(this.directories[dir], '**/*' + ext);
    };
    grunt.initConfig({
        distFolder: 'dist',
        reportsFolder: 'reports/**/*',
        pkg: pkg,
        jshint: {
            options: grunt.file.readJSON('.jshint.json'),
            scripts: scripts
        },
        jscs: {
            src: scripts,
            options: {
                config: ".jscs.json"
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: ['<%= distFolder %>', '<%= reportsFolder %>/*', 'nightwatch', 'phantomjsdriver.log']
                }]
            }
        },
        copy: {
            main: {
                files: [{
                    src: 'bin/nightwatch',
                    dest: 'nightwatch'
                }]
            }
        },
        chmod: {
            options: {
                mode: '775'
            },
            makeExecutable: {
                src: ['./dist/<%= pkg.name %>', 'nightwatch']
            }
        },
        watch: {
            scripts: {
                files: scripts,
                tasks: ['quality', 'test']
            }
        },
        nodeunit: {
            scripts: 'tests/unit/*.js'
        },
        'node-inspector': {
            custom: {
                options: {
                    'web-port': 8080,
                    'web-host': 'localhost',
                    'debug-port': 5858,
                    'save-live-edit': true
                }
            }
        },
        spawn: {
            appium: {
                command: "appium",
                commandArgs: ["-p 5555"]
                // , 
                // directory: "./",
                // pattern: "**/*.js",
                // useQuotes: true,
                // quoteDelimiter: "\"",
                // groupFiles: true,
                // fileDelimiter: " ", 
                // ignore: ["notNeededFile.js"]
            }
            // ,
            // list: {
            //   command: "ls",
            //   commandArgs: ["-la", "{0}"], 
            //   directory: "./tests"
            // },
            // test: {
            //   command: "mocha",
            //   commandArgs: ["--reporter", "spec", "{0}"],
            //   directory: "./tests",
            //   pattern: "**/*.js"
            // }
        },
        concurrent: {
            protractor: {
                tasks: ['debug', 'watch', 'protractor_webdriver'],
                options: {
                    logConcurrentOutput: true
                }
            },
            appium: {
                tasks: ['debug', 'watch', 'spawn'],
                options: {
                    logConcurrentOutput: true
                }
            },
            mfunctest: {
                tasks: ['spawn'],
                options: {
                    logConcurrentOutput: true
                }
            },
            functest: {
                tasks: ['protractor_webdriver'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        protractor_webdriver: {
            default_options: {},
            custom_options: {
                options: {
                    path: '',
                    command: ''
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['bin/<%= pkg.name %>', 'lib/*.js'],
                dest: '<%= distFolder %>/<%= pkg.name %>'
            }
        }
    });
    require('load-grunt-tasks')(grunt);
    grunt.registerTask('test', ['nodeunit']);
    grunt.registerTask('quality', ['jshint', 'jscs']);
    grunt.registerTask('debug', ['node-inspector']);
    grunt.registerTask('work', ['concurrent:protractor']);
    grunt.registerTask('m-work', ['concurrent:appium']);
    grunt.registerTask('m-functest', ['concurrent:mfunctest']); // TODO: Add func test support for the actual testing, not just starting the server.
    grunt.registerTask('functest', ['concurrent:functest']); // TODO: Add func test support for the actual testing, not just starting the server.
    grunt.registerTask('default', ['clean', 'quality', 'test', 'concat', 'copy', 'chmod']);
    grunt.registerTask('build', ['default']);
};