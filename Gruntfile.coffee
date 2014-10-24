console.log "Building with Grunt"
module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)
  webDir = "public"

  grunt.initConfig {
    requirejs: {
      compile: {
        options: {
          baseUrl: webDir + "/script",
          mainConfigFile: webDir + "/script/main.js",
          name: "main",
          out: webDir + "/turtleroy.js",
          optimize: "none",
          exclude: [ "roy" ]
        }
      }
    },
    watch: {
      js: {
        files: [webDir + "/script/**"],
        tasks: 'requirejs'
      }
    }
  }

  grunt.registerTask 'build', ['requirejs']
  grunt.registerTask 'default', [ 'build', 'watch' ]
