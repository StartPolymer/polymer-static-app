'use strict';

// Include Gulp, Plugins & Config
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var config = require('./gulp/psa-config');

// Get a task from the tasks directory with default parameters
function getTask(task) {
  return require('./gulp/tasks/' + task)(gulp, plugins, config);
}

// Tasks
// -----

// Copy Web Fonts To Dist
gulp.task('fonts', getTask('fonts'));

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', getTask('html'));

// Optimize Images
gulp.task('images', getTask('images'));

// Lint JavaScript
gulp.task('jshint', require('./gulp/tasks/jshint')(gulp, plugins, browserSync));

// Metalsmith
gulp.task('metalsmith', getTask('metalsmith'));

// Compile and Automatically Prefix Stylesheets
gulp.task('styles',
  require('./gulp/tasks/styles-sass')(gulp, plugins, config, 'styles'));

// Compile and Automatically Prefix Stylesheets for elements
gulp.task('styles:elements',
  require('./gulp/tasks/styles-sass')(gulp, plugins, config, 'elements'));

// Compile and Automatically Prefix Stylesheets for build a element
gulp.task('styles-build-element',
  require('./gulp/tasks/styles-sass')(gulp, plugins, config, ''));

// Views with Jade
gulp.task('views', getTask('views-jade'));

// Inject bower components
gulp.task('wiredep', getTask('wiredep'));


// Serve Tasks
// -----------

// Watch Files For Changes & Reload
gulp.task('serve:base',
  require('./gulp/tasks/serve')(gulp, config, browserSync));

gulp.task('serve', [
//    'views',
    'fonts'
  ], function (cb) {
    require('run-sequence')(
      'styles',
      'styles:elements',
      'serve:base',
      cb
    );
  }
);

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'],
  require('./gulp/tasks/serve-dist')(gulp, config, browserSync));


// Build Task and Subtasks
// -----------------------

// Get gzipped size of build
gulp.task('build-size', getTask('build-size'));

// Clean Output Directory
gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

// Copy All Files At The Root Level (app)
gulp.task('copy', getTask('copy'));

// Copy files only for build a element
gulp.task('copy-build-element', getTask('copy-build-element'));

// Gzip text files
gulp.task('gzip', getTask('gzip'));

// Updating all references in manifest to revved files
gulp.task('revreplace', getTask('revreplace'));

// Vulcanize imports
gulp.task('vulcanize', getTask('vulcanize'));

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  require('run-sequence')(
//    'views',
    ['copy', 'styles'],
    ['jshint', 'images', 'fonts', 'html', 'styles:elements'],
    'vulcanize',
    'revreplace',
//    'gzip',
//    'build-size',
    cb);
});

// Build Production Files for element
gulp.task('build:el', ['clean'], function (cb) {
  require('run-sequence')(
//    'views',
    ['copy-build-element'],
    ['jshint', 'styles-build-element'],
//    'gzip',
//    'build-size',
    cb);
});


// Deploy Tasks
// ------------

// Deploy to GitHub Pages
gulp.task('deploy:gh', ['default'], getTask('deploy-github-pages'));


// Tool Tasks
// -----------

// Run PageSpeed Insights
gulp.task('pagespeed', getTask('pagespeed'));


// Test Tasks
// ----------

// Load tasks for web-component-tester
// Adds tasks for `gulp test:local` and `gulp test:remote`
try { require('web-component-tester').gulp.init(gulp); } catch (err) {}
