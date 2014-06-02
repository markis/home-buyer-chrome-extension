module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      compile: {
        options: {
          baseUrl: './',
          dir: './extension',
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
        src: 'extension/manifest.release.json',
        dest: 'extension/manifest.json'
      },
    },
    clean: [
      'extension/extension', 
      'extension/lib', 
      'extension/models', 
      'extension/modules', 
      'extension/node_modules', 
      'extension/views',  
      'extension/build.js',  
      'extension/build.txt',
      'extension/Gruntfile.js',  
      'extension/manifest.release.json', 
      'extension/package.json', 
      'extension/settings.js'
    ],
    cssmin: {
      extension_files: {
        files: {
          'extension/css/content.css': 'extension/css/content.css'
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
          'extension/background.js': 'extension/background.js',
          'extension/content.js': 'extension/content.js',
        },
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['requirejs', 'copy', 'clean', 'uglify', 'cssmin']);
};