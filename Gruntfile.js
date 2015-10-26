/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global require,module */
var tasks = [
  'grunt-concat-sourcemap',
  'grunt-contrib-jshint',
  'grunt-contrib-uglify',
  'grunt-contrib-watch'
];
var defaultTasks = [
  'uglify',
  'watch'
];
var projectJs = [
  'src/peach.js',
  'src/peach.*.js',
  'src/peach.fn/peach.fn.tools.js',
  'src/peach.fn/peach.*.js',
];
function allJs() {
  var vendor = [];
  var all = vendor.concat(projectJs);
  return all;
}
module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner    : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap : true,
        mangle    : false,
        compress  : false
      },
      js: {
        files: {
          'peach.min.js': allJs()
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/*.js', 'src/**/*.js'],
        tasks: ['uglify'],
        options: {}
      },
      configFiles: {
        files: ['Gruntfile.js'],
        options: {
          reload: true
        },
        tasks: ['default']
      }
    },
    jshint: {
      all: projectJs
    }
  });
  for (var i = 0; i < tasks.length; i++) {
    grunt.loadNpmTasks(tasks[i]);
  }
  grunt.registerTask('default', defaultTasks);
};
