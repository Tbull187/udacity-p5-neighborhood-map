module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: {
<<<<<<< HEAD
        src: ['js/app.js']
      }
    },
    uglify: {
      my_target: {
        files: {
          'js/app.min.js':['js/app.js']
        }
      }
    },
    cssmin: {
      target: {
        files: {
          'css/styles.min.css':['css/styles.css']
        }
      }
    }
  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

};