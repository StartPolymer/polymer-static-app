'use strict';

// Metalsmith
module.exports = function(gulp, plugins, config) { return function() {
  var fs            = require('fs'),
      merge         = require('merge'),
      metalsmith    = require('metalsmith'),
      moment        = require('moment'),
      yaml          = require('js-yaml');

  var branch        = require('metalsmith-branch');
  var collections   = require('metalsmith-collections');
  var each          = require('metalsmith-each');
  var excerpts      = require('metalsmith-excerpts');
  var feed          = require('metalsmith-feed');
  var markdown      = require('metalsmith-markdownit');
  var permalinks    = require('metalsmith-permalinks');
  var sitemap       = require('metalsmith-sitemap');
  var tags          = require('metalsmith-tags');
  var templates     = require('metalsmith-templates');
  var validate      = require('metalsmith-validate');
  var wordcount     = require('metalsmith-word-count');
  var writemetadata = require('metalsmith-writemetadata');

  var buildDate = new Date();
  var appConfig = yaml.safeLoad(fs.readFileSync(
    './configs/' + config.metalsmith.config + '/app.yml',
    'utf-8'
  ));


  function getPostsCollectionConfig() {
    var conf = {};
    var template = {
      pattern: 'posts/**/*.LANG.md',
      sortBy: 'date',
      reverse: true
    };
    for (var x in appConfig.lang.list) {
      var lang = appConfig.lang.list[x];
      var clonedTemplate = merge(true, template);
      clonedTemplate.pattern = template.pattern.replace('LANG', lang);
      conf['posts-' + lang] = clonedTemplate;
    }
    return conf;
  }

  return metalsmith('./')
    .source('contents/' + appConfig.dir.content)
    .destination('dist')

    .metadata(appConfig)

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
        'date_modify': {
          exists: true,
          type: 'Date'
        },
        author: true,
        'author_url': true,
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

    .use(collections(merge({
      pages: {
        pattern: 'pages/**/*.md'
      }},
      getPostsCollectionConfig()
    )))

    .use(markdown())
    .use(excerpts())

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
      .use(wordcount({
        metaKeyCount: 'wordCount',
        metaKeyReadingTime: 'readingTime',
        speed: 300,
        seconds: false,
        raw: false
      }))
    )

    .use(feed({
      collection: 'posts-en',
      limit: 10,
      destination: 'feed.xml'
    }))

    .use(sitemap({
      output: 'sitemap.xml',
      urlProperty: 'path',
      hostname: appConfig.site.url,
      defaults: {
        priority: 0.5,
        changefreq: 'daily'
      }
    }))

    .use(writemetadata({
      pattern: ['**/*.html'],
      ignorekeys: ['next', 'previous'],
      bufferencoding: 'utf8',
      collections: {
        'posts-en': {
          output: {
            path: 'en/posts.json',
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
