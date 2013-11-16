var path = require('path');
var fs = require('fs');

module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('./package.json');
  grunt.initConfig({
    pkg: pkg,
    concat: {
      nodeps: {
        options: {
          banner: grunt.file.read('build/header.js'),
          footer: grunt.file.read('build/footer.js')
        },
        src: ['src/module.js',
          'src/**/*.js',
          '<%= css2js.all.dest %>'],
        dest: 'dist/<%= pkg.name %>-nodeps.js'
      },
      all: {
        src: ['<%= concat.nodeps.dest %>',
          'components/angular-scrolly/angular-scrolly.js',
          'components/angular-bootstrap/position.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    inlineTemplate: {
      //Output files in same spot with inline templates
      options: {
        base: 'src'
      },
      all: {
        files: {
          '<%= concat.nodeps.dest %>': '<%= concat.nodeps.dest %>',
          '<%= concat.all.dest %>': '<%= concat.all.dest %>'
        }
      }
    },
    cssmin: {
      all: {
        src: ['src/css/**/*.css'],
        dest: '.tmp/angular-jqm.css'
      }
    },
    css2js: {
      all: {
        src: ['.tmp/angular-jqm.css'],
        dest: '.tmp/angular-jqm.css.js'
      }
    },
    uglify: {
      options: {
        preserveComments: 'some'
      },
      all: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      }
    },
    watch: {
      files: ['src/**/*','test/**/*'],
      tasks: ['quickbuild', 'karma:dev:run']
    },
    jshint: {
      options: {
        jshintrc: __dirname + '/.jshintrc'
      },
      dist: {
        files: {
          src: ['<%= concat.nodeps.dest %>']
        },
        options: {
          globals: {
            angular: true,
            window: true
          }
        }
      },
      test: {
        files: {
          src: ['test/unit/**/*.js']
        }
        //options moved to .jshintrc
      }
    },
    connect: {
      server: {
        options: {
          port: 9000,
          base: './',
          hostname: ''
        }
      }
    },
    karma: {
      options: {
        configFile: 'test/config/karma-shared.conf.js',
      },
      dev: {
        options: {
          singleRun: false,
          browsers: ['Chrome']
        },
        background: true
      },
      //We're only allowed two concurrent browsers on saucelabs
      sauce1: {
        configFile: 'test/config/karma-saucelabs.conf.js',
        browsers: ['sauce_ie'/*, 'sauce_firefox'*/], //firefox removed for now because it was failing
      },
      sauce2: {
        configFile: 'test/config/karma-saucelabs.conf.js',
        //Boot up both mobile browsers at once, since they take alot longer to start
        browsers: ['sauce_ios', 'sauce_android'],
      },
      localBuild: {
        options: {
          singleRun: true,
          //Travis CI has firefox, we use it
          browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome']
        }
      }
    },
    changelog: {
      dest: 'CHANGELOG.md'
    },
    ngdocs: {
      options: {
        dest: 'dist/docs/',
        scripts: [
          'docs/scripts/jquery.mobile.css.js',
          'angular.js',
          'components/angular-scrolly/angular-scrolly.js',
          'docs/scripts/angular-scrolly-docs.js'
        ],
        styles: [
          /* TODO css stylesheets are not put into jsfiddles,
             so we use a javascript that adds the style (jquery.mobile.css.js)
             '//cdnjs.cloudflare.com/ajax/libs/jquery-mobile/1.3.2/jquery.mobile.css'
             */
          'docs/scripts/example_resets.css'
        ],
        navTemplate: 'docs/template/nav.html',
        html5Mode: false,
        startPage: '/api',
        title: '<%= pkg.name %>'
      },
      guide: {
        src: ['docs/content/guide/**/*.ngdoc'],
        title: 'Guide'
      },
      api: {
        src: ['src/**/*.js', 'docs/content/api/**/*.ngdoc'],
        title: 'API Documentation'
      },

    },

    //After lots of bower problems, we switched to grunt-curl
    //We will switch back to bower once bower-1.1.2 resolves its problems with zip files
    'curl-dir': {
      'components/angular': [
        'http://code.angularjs.org/1.2.1/angular.js',
        'http://code.angularjs.org/1.2.1/angular-route.js',
        'http://code.angularjs.org/1.2.1/angular-animate.js',
        'http://code.angularjs.org/1.2.1/angular-touch.js',
        'http://code.angularjs.org/1.2.1/angular-mocks.js',
      ],
      'components/jquery-mobile': [
        'http://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.js',
        'http://code.jquery.com/mobile/1.3.2/jquery.mobile-1.3.2.min.css'
      ],
      'components/jquery': [
        'http://code.jquery.com/jquery-1.9.1.js'
      ],
      'components/angular-scrolly': [
        'https://raw.github.com/ajoslin/angular-scrolly/master/angular-scrolly.js'
      ],
      //This is temporary until we have a way to download this easily (all of these will be put on bower in near future)
      'components/angular-bootstrap': [
        'https://raw.github.com/angular-ui/bootstrap/master/src/position/position.js'
      ]
    }
  });

  grunt.registerTask('build', ['quickbuild', 'uglify']);
  grunt.registerTask('quickbuild', ['cssmin', 'css2js', 'concat', 'inlineTemplate']);
  grunt.registerTask('dev', ['connect','karma:dev','watch']);
  grunt.registerTask('default', ['build','jshint','karma:localBuild','ngdocs']);
  grunt.registerTask('install', 'Prepare development environment', function() {
    grunt.task.run('curl-dir');
    install();
  });
  grunt.registerTask('curl', 'curl-dir'); //alias

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-curl');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-inline-template');
  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadTasks('build/grunt');

  function install() {
    if (!grunt.file.exists('.git/hooks/commit-msg')) {
      grunt.file.copy('build/validate-commit-msg.js', '.git/hooks/commit-msg');
      require('fs').chmodSync('.git/hooks/commit-msg', '0755');
      grunt.log.writeln('Installing commit enforce hook.');
    }
  }
};
