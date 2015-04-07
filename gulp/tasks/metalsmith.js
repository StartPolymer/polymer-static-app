'use strict';

// Metalsmith
module.exports = function(gulp, plugins, config) { return function() {
  //var assign        = require('lodash.assign');
  var metalsmith    = require('metalsmith');
  var moment        = require('moment');

  //var api           = require('metalsmith-json-api');
  var branch        = require('metalsmith-branch');
  var collections   = require('metalsmith-collections');
  //var define        = require('metalsmith-define');
  var each          = require('metalsmith-each');
  var excerpts      = require('metalsmith-excerpts');
  var markdown      = require('metalsmith-markdownit');
  //var metadata      = require('metalsmith-metadata');
  var permalinks    = require('metalsmith-permalinks');
  var tags          = require('metalsmith-tags');
  var templates     = require('metalsmith-templates');
  var validate      = require('metalsmith-validate');
  var writemetadata = require('metalsmith-writemetadata');
  //var ignore        = require('metalsmith-ignore');

  var dateBuild = new Date();

  return metalsmith('./')
    .source('app/content')
    .destination('dist')

    .use(each(function(file, filename) {
      file.date_build = dateBuild;
      var data = filename.split('/');
      data = data[data.length - 1].split('.');
      file.name = data[0];
      file.lang = data[1];
    }))
    //.use(metadata({
    //  config: config.metalsmith.configFile
    //}))
    .use(validate([{
      pattern: 'pages/**/*.md',
      metadata: {
        title: true,
        slug: true,
        template: {
          default: 'page.jade'
        }
      }
    }, {
      pattern: 'posts/**/*.md',
      metadata: {
        title: true,
        slug: true,
        tags: {
          exists: true,
          type: 'Array'
        },
        date: {
          exists: true,
          type: 'Date'
        },
        date_modify: {
          exists: true,
          type: 'Date'
        },
        author: true,
        author_url: true,
        template: {
          default: 'post.jade'
        }
      }
    }, {
      // pattern defaults to '**/*'
      metadata: {
        template: {
          pattern: function(value) {
            return value.match(/\.jade$/);
          }
        }
      }
    }]))

    .use(tags({
      handle: 'tags',
      path:'tag/:tag/index.html',
      template:'tag.jade',
      sortBy: 'date',
      reverse: true
    }))

    //.use(findTemplate({
    //  pattern: 'posts',
    //  templateName: 'post.jade'
    //}))
    .use(markdown())
    .use(excerpts())
    .use(collections({
      pages: {
        pattern: 'pages/**/*.html'
      },
      posts: {
        pattern: 'posts/**/*.html'
        //sortBy: 'date',
        //reverse: true
      }
    }))
    .use(templates({
      engine: 'jade',
      directory: 'app/templates',
      moment: moment
    }))
    .use(branch('home/**/*.html')
      .use(permalinks({
        pattern: ':lang'
      }))
    )
    .use(branch('pages/**/*.html')
      .use(permalinks({
        pattern: ':lang/:slug'
      }))
    )
    .use(branch('posts/**/*.html')
      .use(permalinks({
        pattern: ':lang/:slug-:date',
        date: 'YYYYMM'
      }))
    )
    .use(writemetadata({
      pattern: ['**/*.html'],
      ignorekeys: ['next', 'previous'],
      bufferencoding: 'utf8',
      collections: {
        posts: {
          output: {
            path: 'posts.json',
            asObject: true,
            metadata: {
              type: 'list'
            }
          },
          ignorekeys: ['contents', 'history', 'next', 'previous', 'stats']
        }
      }
    }))
    //.use(api())
    .build(function(err, files) {
      if (err) { console.log(err); }
    });

};};
