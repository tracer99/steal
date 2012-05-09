---
layout: default
---

# Welcome to StealJS

StealJS is a collection of command line and JavaScript client utilities
that make building, packaging, and sharing JavaScript 
applications easy. It provides:

 - [Dependency management](#dependency_management) for JS, CSS, LESS, CoffeeScript + more.
 - Fast loading (minified, concatenated, progressive) application builds
 - Search-ability for your ajax apps
 - Source cleaning / linting
 - Boilerplate code generators
 - Instrumentation for code coverage
 - Pluginify

## Get StealJS

StealJS is comprised of 2 main parts - `steal.js` (dependency management) 
and `s.js` (everything else).


## Dependency Management `steal()`

The core dependency management part of StealJS is `steal`.

### Installing

This example setup assumes you keep your JavaScript and CSS files in a "static" directory
in your project.  In this case, for a basic todo app, your directory layout might look like:

 - todo-app/
   - todo.html
   - static
      - todo.js
      - todo.css
      - helper/
         - util.js 

__Step 1__ : Download __steal.js__ and copy it into the static folder so the "static" folder looks like:

 - todo-app/
   - todo.html
   - static
      - __steal.js__
      - todo.js
      - todo.css
      - helper/
         - util.js 

__Step 2__ : In `todo.html`, add a script tag that loads steal and add a "data-main" attribute
that points to `todo.js` relative to `steal.js` like:

{% highlight html %}
<!DOCTYPE html>
<html>
    <head>
        <title>Todos</title>
    </head>
    <body>
        <h1>My Sample Project</h1>
        <script data-main="todo.js" src="static/steal.js"></script>
    </body>
</html>
{% endhighlight %}

__Step 3__: Inside of `todo.js`, use `steal( path, ... )` to load any scripts and css you need to run:

{% highlight javascript %}
steal('todo.css','helper/util.js', function(){
  // this function is called after todo.css and helper/util.js have finished loading
  // if util.js itself has steals, this function will wait until those are also 
  // complete
})
{% endhighlight %}

### Loading scripts and css

### Configuring

### Other Types

### AMD


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
