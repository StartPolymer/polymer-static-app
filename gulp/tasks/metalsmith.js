'use strict';

// Metalsmith
module.exports = function(gulp, plugins, config) { return function() {
  var metalsmith    = require('metalsmith');
  var moment        = require('moment');

  var branch        = require('metalsmith-branch');
  var collections   = require('metalsmith-collections');
  var each          = require('metalsmith-each');
  var excerpts      = require('metalsmith-excerpts');
  var feed          = require('metalsmith-feed');
  var ignore        = require('metalsmith-ignore');
  var markdown      = require('metalsmith-markdownit');
  var metadata      = require('metalsmith-metadata');
  var permalinks    = require('metalsmith-permalinks');
  var sitemap       = require('metalsmith-sitemap');
  var tags          = require('metalsmith-tags');
  var templates     = require('metalsmith-templates');
  var validate      = require('metalsmith-validate');
  var wordcount     = require('metalsmith-word-count');
  var writemetadata = require('metalsmith-writemetadata');

  var buildDate = new Date();

  return metalsmith('./')
    .source(config.metalsmith.contentDir)
    .destination('dist')

    .use(metadata({
      site: 'metadata/site.yaml'
    }))
    .use(ignore('metadata/*'))

    .use(each(function(file, filename) {
      file.buildDate = buildDate;
      var data = filename.split('/');
      data = data[data.length - 1].split('.');
      file.name = data[0];
      file.lang = data[1];
    }))

    .use(validate([{
      pattern: 'home/**/*.md',
      metadata: {
        title: true,
        template: {
          default: 'home.jade'
        }
      }
    }, {
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
        modifyDate: {
          exists: true,
          type: 'Date'
        },
        author: true,
        authorUrl: true,
        template: {
          default: 'post.jade'
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

    .use(markdown())
    .use(excerpts())

    .use(collections({
      pages: {
        pattern: 'pages/**/*.html'
      },
      posts: {
        pattern: 'posts/**/*.html',
        sortBy: 'date',
        reverse: true
      }
    }))

    .use(templates({
      engine: 'jade',
      directory: config.metalsmith.templatesDir,
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

    .use(feed({collection: 'posts'}))
    .use(sitemap({
      output: 'sitemap.xml',
      urlProperty: 'path',
      hostname: config.metalsmith.sitemapUrl,
      defaults: {
        priority: 0.5,
        changefreq: 'daily'
      }
    }))

    .use(wordcount({
      metaKeyCount: 'wordCount',
      metaKeyReadingTime: 'readingTime',
      speed: 300,
      seconds: false,
      raw: false
    }))

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

    .build(function(err, files) {
      if (err) { console.log(err); }
    });
  };
};
