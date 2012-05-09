---
layout: default
---

# Welcome to StealJS

StealJS is a collection of command line and JavaScript client utilities
that make building, packaging, and sharing JavaScript applications easy.

Behold StealJS's goodies:

## Dependency Management

StealJS loads JS and other file into your app.  Features:

 - Loads JavaScript, CSS, Less, CoffeeScript, and a variety of client-side templates.
 - Can be use with scripts that don't use steal.

{% highlight javascript %}
steal('widgets/tabs.js', './style.css', function(){
  $('#tabs').tabs();
});
{% endhighlight %}

## JS/CSS Compression

The *steal.build* plugin combines an application's files into a single minified
JavaScript and CSS file extremely easy.  Features:

- Configurable compressors (defaults to Google Closure).
- Compresses Less and CoffeeScript.
- Pre-processes and compresses client-side templates (templates don't have to be parsed).

	js steal/buildjs mypage.html

## Logging

*steal.dev* logs messages cross browser.  Messages are removed in production builds.

{% highlight javascript %}
steal.dev.log('something is happening');
{% endhighlight %}

## Code Generators

*steal.generate* makes building code generators extremely easy.  Features:

- Pre-packaged JMVC style code generators.
- Easily author custom generators.

	js jquery/generate/app cookbook

## Package Management

*steal.get* is a simple JavaScript version of [ruby gems](http://rubygems.org/) featuring:

- Download and install plugins from remote SVN or GIT repositories.
- Installs dependencies.

	js steal/getjs http://github.com/jupiterjs/mxui/

## Code Cleaner

*steal.clean* cleans your code and checks it against JSLint.

	js steal/clean path/to/page.html

## Searchable Ajax Apps

*steal.html* makes Google-crawlable html from your ajax app.

	js steal/htmljs http://localhost/cookbook.html#recipes
