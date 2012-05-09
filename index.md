---
layout: default
---

# Welcome to StealJS

StealJS is a collection of command line and JavaScript client utilities
that make building, packaging, and sharing JavaScript 
applications easy. It provides:

 - [steal\(\)](#steal) - dependency management for JS, CSS, LESS, CoffeeScript + more.
 - [steal build](#build) - Fast loading (minified, concatenated, progressive) application builds
 - [steal crawl](#crawl) - Search-ability for your ajax apps
 - [steal clean](#clean) - Source cleaning / linting
 - [steal generate](#generate) - Boilerplate code generators
 - [steal pluginify](#pluginify) - Release code that doesn't use steal
 - [steal.instrument](#instrument) - Instrumentation for code coverage
 - [steal.amd](#amd) - AMD support for steal

## Get StealJS

StealJS is comprised of 2 main parts - `steal.js` (dependency management) 
and `steal` (command line tools).  There several different ways to install
StealJS, but we'll highlight the best / easist here:

### Install steal

First, install node.  Then run

    > npm install -g steal
    
You should be able to run steal anywhere.  You might have to run `sudo`.  Try it:

    > steal
    
Now you can run all of steal's command lines.  Now lets setup the dependency management part.

### Install steal.js

This example setup assumes you keep your JavaScript and CSS files in a "static" directory
in your project.  In this case, for a basic todo app, your directory layout might look like:

 - todo-app/
   - todo.html
   - static
      - todo.js
      - todo.css
      - helper/
         - util.js 

Download __steal.js__ and copy it into the static folder so the "static" folder looks like:

 - todo-app/
   - todo.html
   - static
      - __steal.js__
      - todo.js
      - todo.css
      - helper/
         - util.js 

You could also use the generator to do this for you like:

    > steal generate steal.js path/to/todo-app/static

### Load steal.js

In `todo.html`, add a script tag that loads steal and add a "data-main" attribute
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

### steal something

Inside of `todo.js`, use `steal( path, ... )` to load any scripts and css you need to run:

{% highlight javascript %}
steal('todo.css','helper/util.js', function(){
  // this function is called after todo.css and helper/util.js have finished loading
  // if util.js itself has steals, this function will wait until those are also 
  // complete
})
{% endhighlight %}

## steal `steal( resources..., [callback] )`

[steal\(\)](http://donejs.com/docs.html#steal) is a function that loads scripts, css, and other
resources in parallel and calls a callback function when complete.

To load a JavaScript or CSS file, provide the path relative to the folder steal.js is in:

{% highlight javascript %}
steal('path/to/myfile.js','styles/mystyle.css')
{% endhighlight %}




### Loading scripts and css

### Configuring

### Other Types




## build `steal build [OPTS] filename.js`

The *steal.build* plugin combines an application's files into a single minified
JavaScript and CSS file extremely easy.  Features:

- Configurable compressors (defaults to Google Closure).
- Compresses Less and CoffeeScript.
- Pre-processes and compresses client-side templates (templates don't have to be parsed).

	js steal/buildjs mypage.html

## crawl `steal crawl [OPTS] website.html`

*steal.html* makes Google-crawlable html from your ajax app.

	js steal/htmljs http://localhost/cookbook.html#recipes

## clean `steal crawl [OPTS] filename.js`

*steal.clean* cleans your code and checks it against JSLint.

	js steal/clean path/to/page.html

## generate `steal generate path/to/boilerplate boilerplate`

*steal.generate* makes building code generators extremely easy.  Features:

- Pre-packaged JMVC style code generators.
- Easily author custom generators.

	js jquery/generate/app cookbook

## pluginify `steal pluginify [OPTS] filename.js`

blah

## instrument `steal('steal/instrument')`

Blah

## log `steal.log()`

*steal.dev* logs messages cross browser.  Messages are removed in production builds.

{% highlight javascript %}
steal.dev.log('something is happening');
{% endhighlight %}

## amd `require()` `define()`




