module.exports = function(grunt) {
  var srcFiles = grunt.file.readJSON('./build/files.js'),
      pkg = grunt.file.readJSON('./package.json');
  // needed for karma to locate phantomjs correctly.
  process.env.PHANTOMJS_BIN = './node_modules/.bin/phantomjs';
  grunt.initConfig({
    pkg: pkg,
    concat: {
      all: {
        options: {
          banner: grunt.file.read('build/header.js'),
          footer: grunt.file.read('build/footer.js')
        },
        src: srcFiles.concat('<%= html2js.all.dest %>').concat('<%= css2js.all.dest %>'),
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    html2js: {
      options: {
        base: 'src',
        module: 'jqm-templates'
      },
      all: {
        src: ['src/templates/**/*.html'],
        dest: '.tmp/angular-jqm-templates.js'
      }
    },
    css2js: {
      all: {
        src: ['src/css/**/*.css'],
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
      tasks: ['html2js','css2js','concat','karma:dev:run']
    },
    jshint: {
      options: {
        strict: true,
        globalstrict: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        trailing: true
      },
      dist: {
        files: {
          src: ['dist/<%= pkg.name %>.js']
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
        },
        options: {
          globals: {
            /* By purpose: No iit, xit, ddescribe, xdescribe should
               be present in code that is committed */
            describe: true,
            beforeEach: true,
            afterEach: true,
            it: true,
            runs: true,
            waitsFor: true,
            waits: true,
            spyOn: true,
            expect: true,
            jasmine: true,
            window: true,
            document: true,
            location: true,
            angular: true,
            inject: true,
            module: true,
            dump: true,
            testutils: true
          }
        }
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
        configFile: 'test/config/karma.conf.js',
        files: ['node_modules/grunt-karma/node_modules/karma/adapter/lib/jasmine.js',
                'node_modules/grunt-karma/node_modules/karma/adapter/jasmine.js',
                'components/angular/angular.js',
                'components/angular/angular-mobile.js',
                'components/angular/angular-mocks.js',
                'test/lib/testutils.js',
                'test/lib/matchers.js'].
                concat('<%= html2js.all.dest %>').
                concat(srcFiles).
                concat(['test/**/*Spec.js']).
                concat([{pattern: 'test/**/*', watched: true, included: false, served: true},
                        {pattern: 'components/**/*', watched: true, included: false, served: true}])
      },
      dev: {
        options: {
          singleRun: false,
          browsers: ['PhantomJS']
        },
        background: true
      },
      travis: {
        options: {
          singleRun: true,
          browsers: ['PhantomJS']
        }
      },
      localBuild: {
        options: {
          singleRun: true,
          browsers: ['PhantomJS']
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
          '//ajax.googleapis.com/ajax/libs/angularjs/1.1.5/angular-mobile.js',
          '<%= concat.all.dest %>',
        ],
        styles: [
          /* TODO css stylesheets are not put into jsfiddles,
             so we use a javascript that adds the style (jquery.mobile.css.js)
          '//cdnjs.cloudflare.com/ajax/libs/jquery-mobile/1.3.1/jquery.mobile.css'
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
      }
    }
  });

  grunt.registerTask('install', 'Prepare development environment', install); 
  grunt.registerTask('build', ['html2js', 'css2js', 'concat']);
  grunt.registerTask('dev', ['connect','karma:dev','watch']);
  grunt.registerTask('default', ['install','build','jshint','karma:localBuild','ngdocs']);
  grunt.registerTask('travis', ['build','jshint','karma:travis']);

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadTasks('build/grunt');

  function install() {
      if (!grunt.file.exists('.git/hooks/commit-msg')) {
          grunt.file.copy('build/validate-commit-msg.js', '.git/hooks/commit-msg');
          require('fs').chmodSync('.git/hooks/commit-msg', '0755');

          var gitconfig = grunt.file.read('.git/config');
          gitconfig += '\n' + grunt.file.read('build/git-config');
          grunt.file.write('.git/config', gitconfig);

          grunt.log.writeln('Installing commit enforce hook, dist merge hook.');
      }
  }
};
