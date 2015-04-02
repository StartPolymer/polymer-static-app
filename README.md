# Polymer Static App

Polymer [Static Web Application](http://www.staticapps.org)
boilerplate based on [Polymer Starter Kit](https://github.com/StartPolymer/polymer-starter-kit)
and [Metalsmith](http://www.metalsmith.io).

:sparkles: [DEMO](http://polymer-static-app.startpolymer.org) :sparkles:

## Features

- Content in [Markdown format](http://commonmark.org) parsed by
[markdown-it](https://markdown-it.github.io)
- [Jade](http://jade-lang.com) HTML template engine
 - Jade have [Variables](http://jade-lang.com/reference/code/),
 [Includes](http://jade-lang.com/reference/includes/),
 [Extends](http://jade-lang.com/reference/extends/),
 [Mixins](http://jade-lang.com/reference/mixins/) and other features
 - [Learning Jade with Codecast](http://cssdeck.com/labs/learning-the-jade-templating-engine-syntax)
- Quick deploy to [CDN](http://en.wikipedia.org/wiki/Content_delivery_network) Hosting
 - [GitHub Pages](https://pages.github.com) - [more info](https://github.com/blog/1715-faster-more-awesome-github-pages)

## Installation

### Tools on Ubuntu

```sh
# Add Ruby repository
sudo add-apt-repository -y ppa:brightbox/ruby-ng
# Script to install NodeSource repository
curl -sL https://deb.nodesource.com/setup | sudo bash -
# Install Git, Node.js and Ruby
sudo apt-get install -y git nodejs ruby2.2
# Install Bower, Gulp and NPM
sudo npm install -g bower gulp npm
# Install Sass
sudo gem install sass
```

- [Atom](https://atom.io) is great editor for web development, you can use
[Atom on Ubuntu](https://gist.github.com/JosefJezek/6d7386cb7011cc8f5d37) script.
- For other OS, you can use [Ubuntu VM Image](http://www.osboxes.org/ubuntu/) or Google Search :wink:

## Usage

### [Fork](https://github.com/StartPolymer/polymer-static-app/fork) this repository

[Syncing a fork](https://help.github.com/articles/syncing-a-fork/)
of a repository to keep it up-to-date with the upstream repository.

or

### Clone this repository to separate branch `psa`

```sh
git clone https://github.com/StartPolymer/polymer-static-app.git <my-repo-name>
cd <my-repo-name>
git branch -m psa
git checkout -b master
git remote rename origin psa
git remote add origin https://github.com/<user>/<my-repo-name>.git
git push -u origin master
```

[How to use Git](https://gist.github.com/JosefJezek/775e54583ef319c8c641)

### Install dependencies

```sh
bower install && npm install
```

### Check out the variables

- Gulp variables are in the file [gulp/psk-config.js](https://github.com/StartPolymer/polymer-static-app/blob/master/gulp/psk-config.js)

### Serve to local and external URL

`http://localhost:9000` and `http://<Your IP>:9000`

```sh
gulp serve
```

#### Build and serve the output from the dist build

```sh
gulp serve:dist
```

### Build the app

```sh
gulp
```

## Deploy :tada:

### Deploy to GitHub Pages

First you need to be sure you have a gh-pages branch. If you don't have one, you can do the following:

```sh
git checkout --orphan gh-pages
git rm -rf .
touch README.md
git add README.md
git commit -m "Init gh-pages"
git push --set-upstream origin gh-pages
git checkout master
```

```sh
gulp deploy:gh
```

## Tools

### PageSpeed Insights

```sh
gulp pagespeed
```

## Contributing :+1:

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Make your changes
4. Run the tests, adding new ones for your own code if necessary
5. Commit your changes (`git commit -am 'Added some feature'`)
6. Push to the branch (`git push origin my-new-feature`)
7. Create new Pull Request

## [MIT License](https://github.com/StartPolymer/polymer-static-app/blob/master/LICENSE)

Copyright (c) 2015 Start Polymer ([http://startpolymer.org](http://startpolymer.org))
