module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Tasks
    postcss: {//Post CSS (autoprefixer) Plugin
      options: {
        map: false,
        processors: [
          require('autoprefixer')({
            browsers: ['last 2 versions']
          })
        ]
      },
      dist: {
        src: 'src/styles/css/main.css',
        dest: 'src/styles/css/main.css'
      }
    },
    cssmin: {//CSS Minify Plugin
      target: {
        files: [{
          expand: true,
          cwd: 'src/styles/css',
          src: ['*.css', '!*.min.css'],
          dest: 'src/styles/css',
          ext: '.min.css'
        }]
      }
    },
    /*
    uglify: { // Begin JS Uglify Plugin
      build: {
        src: ['src/*.js'],
        dest: 'js/script.min.js'
      }
    },
    */
    watch: {// Compile everything into one task with Watch Plugin
      grunt: { files: ['Gruntfile.js'] },
      css: {
        files: '**/*.scss',
        tasks: ['postcss', 'cssmin']
      }//,
      //js: {
      //  files: '**/*.js',
      //  tasks: ['uglify']
      //}
    }
  });
  // Load Grunt plugins
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-postcss')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch')

  // Register Grunt tasks
  grunt.registerTask('default', ['watch'])
};
