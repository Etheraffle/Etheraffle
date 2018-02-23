module.exports =  (grunt) => {
    grunt.initConfig({
        autoprefixer: {
            dist: {
                files: {
                    'src/styles/css/main.css': 'main.css'
                }
            }
        },
        watch: {
            styles: {
                files: ['main.css'],
                tasks: ['autoprefixer']
            }
        }
    });
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
