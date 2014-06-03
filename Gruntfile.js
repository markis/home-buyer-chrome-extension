module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      compile: {
        options: {
          baseUrl: './app',
          dir: './build',
          optimizeCss: 'none',
          optimize: 'none',
          keepBuildDir: true,
          modules : [
            {
                name: 'content',
                include: ['almond', 'content']
            },
            {
                name: 'background',
                include: ['almond', 'background']
            }
          ],
          paths: {
            'almond': './lib/almond',
            'backbone': './lib/backbone.min',
            'jquery': './lib/jquery.min',
            'underscore': './lib/underscore.min'
          }
        }
      }
    },
    copy: {
      main: {
        src: 'build/manifest.release.json',
        dest: 'build/manifest.json'
      },
    },
    clean: [
      'build/build', 
      'build/lib', 
      'build/models', 
      'build/modules', 
      'build/node_modules', 
      'build/views',  
      'build/.gitignore', 
      'build/build.js',  
      'build/build.txt',
      'build/Gruntfile.js',  
      'build/manifest.release.json', 
      'build/package.json', 
      'build/settings.js'
    ],
    cssmin: {
      extension_files: {
        files: {
          'build/css/content.css': 'build/css/content.css'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! Home Buyer - Chrome Extension - Copyright (C) <%= grunt.template.today("yyyy") %>  Markis Taylor - See http://www.gnu.org/licenses/ */\n',
        mangle: {
          except: ['jQuery', 'Backbone']
        },
        compress: {
          drop_console: true
        }
      },
      extension_files: {
        files: {
          'build/background.js': 'build/background.js',
          'build/content.js': 'build/content.js',
        },
      },
    },
    compress: {
      main: {
        options: {
          archive: function () {
            // The global value git.tag is set by another task
            return 'chrome-extension.zip'
          }
        },
        files: [
          {expand: true, src: ['build/*'], dest: '/'}
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['requirejs', 'copy', 'clean', 'uglify', 'cssmin', 'compress']);
};