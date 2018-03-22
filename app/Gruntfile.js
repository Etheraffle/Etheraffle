module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Tasks
    /*
    sass: {
			dist: {
				files: {
          'src/styles/css/main.css' : 'src/styles/sass/main.scss'
			}
		},*/
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
    watch: {//Compile everything into one task with Watch Plugin
      grunt: { files: ['Gruntfile.js'] },
      css: {
        files: 'src/styles/**/*.scss',
        tasks: ['postcss', 'cssmin']//['sass', 'postcss', 'cssmin']
      }
    }
  });
  // Load Grunt plugins
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-postcss')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  // Register Grunt tasks
  grunt.registerTask('default', ['watch'])
};
