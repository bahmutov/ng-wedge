/* global module */
module.exports = function (grunt) {
  module.require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    'nice-package': {
      all: {
        options: {
          blankLine: true
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-summary')
      },
      default: {
        src: ['*.js', 'test/*.js'],
      }
    },

    'gh-pages': {
      options: {
        base: '.'
      },
      src: [
        'index.html',
        'README.md',
        'node_modules/angular/angular.js',
        'node_modules/lazy-ass/index.js',
        'ng-wedge.js'
      ]
    },

    sync: {
      all: {
        options: {
          sync: ['author', 'name', 'version',
            'private', 'license', 'keywords', 'homepage'],
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.js']
      }
    },

    'clean-console': {
      all: {
        options: {
          url: ['index.html'],
          timeout: 1
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        background: false,
        singleRun: true,
        logLevel: 'INFO',
        browsers: ['PhantomJS']
      }
    },

    watch: {
      options: {
        atBegin: true
      },
      all: {
        files: ['*.js', 'test/*.js', 'index.html'],
        tasks: ['jshint', 'test']
      }
    }
  });

  var plugins = module.require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('test', ['mochaTest', 'karma', 'clean-console']);
  grunt.registerTask('default', ['deps-ok', 'nice-package', 'sync', 'jshint', 'test']);
};
