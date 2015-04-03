'use strict';

// Metalsmith
module.exports = function(gulp, plugins, config) { return function() {
  var assign        = require('lodash.assign');
  var metalsmith    = require('gulpsmith')();
  var moment        = require('moment');

  var collections   = require('metalsmith-collections');
  var markdown      = require('metalsmith-markdownit');
  var metadata      = require('metalsmith-metadata');
  var permalinks    = require('metalsmith-permalinks');
  var templates     = require('metalsmith-templates');
  //var ignore        = require('metalsmith-ignore');


  // filter out files with front matter
  //var fmFilter = $.filter('**/*.{html,md,htb}');

  // Add a template key to posts (if there is none), so we’ll need to filter out our posts first.
  var findTemplate = function(config) {
    var pattern = new RegExp(config.pattern);

    return function(files, metalsmith, done) {
      for (var file in files) {
        if (pattern.test(file)) {
          var _f = files[file];
          if (!_f.template) {
            _f.template = config.templateName;
          }
        }
      }

      done();
    };
  };

  metalsmith
    .use(metadata({
      config: config.metalsmith.configFile
    }))
    .use(markdown())
    .use(templates({
      engine: 'jade',
      directory: './templates',
      moment: moment
    }))
    //.use(ignore([
    //  'templates/**/*'
    //]))
    .use(permalinks({
      pattern: ':slug-:date',
      date: 'YYYYMM'
    }))
    .use(collections({
      pages: {
        pattern: 'pages/*.md'
      },
      posts: {
        pattern: 'posts/**/*.md',
        sortBy: 'date',
        reverse: true
      }
    }));

  return gulp.src('./content/**/*.md')

    //.pipe(fmFilter)

    // Grab files with front matter and assign them as a property so metalsmith will find it
    .pipe(plugins.frontMatter({
      property: 'frontMatter'
    })).on('data', function(file) {
      assign(file, file.frontMatter);
      delete file.frontMatter;
    })

    .pipe(metalsmith)
    .pipe(gulp.dest('./dist'));

  // remove the filter (back to everything in /src) and let metalsmith do its thing
  //.pipe(fmFilter.restore())

};};
