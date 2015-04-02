'use strict';

// Metalsmith
module.exports = function (gulp, plugins, config) { return function () {
  var gulpsmith     = require('gulpsmith'),
      assign        = require('lodash.assign'),
      markdown      = require('metalsmith-markdownit'),
      templates     = require('metalsmith-templates'),
      ignore        = require('metalsmith-ignore'),
      permalinks    = require('metalsmith-permalinks'),
      collections   = require('metalsmith-collections');

      var fmFilter = $.filter('**/*.{html,md,htb}'); // filter out files with front matter

  return gulp.src('./src/**/*')
    .pipe(fmFilter)
    // grab files with front matter and assign them as a property so metalsmith will find it
    .pipe(plugins.frontMatter({
      property: 'frontMatter'
    })).on('data', function(file) {
        assign(file, file.frontMatter);
        delete file.frontMatter;
    })
    // remove the filter (back to everything in /src) and let metalsmith do its thing
    .pipe(fmFilter.restore())
    .pipe(
      gulpsmith()
        .metadata({
          'title': [ config.siteTitle ],
          'description': [ config.siteDescription ]
        })
        .use(markdown())
        .use(templates({
          'engine': 'jade',
          'directory': './src/templates'
        }))
        .use(ignore([
          'templates/**/*'
        ]))
        .use(permalinks(':title'))
        .use(collections({
          'posts': 'posts/*.md'
        }))
    )
    .pipe(gulp.dest('./dist'))
    .pipe($.connect.reload());

};};
