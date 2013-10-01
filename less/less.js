steal({id: "./less_engine.js",ignore: true}, function(){
	// only if rhino and we have less
	if(steal.isRhino && window.less) {
		// Some monkey patching of the LESS AST
		// For production builds we NEVER want the parser to add paths to a url(),
		// the CSS postprocessor is doing that already.
		(function(tree) {
			var oldProto = tree.URL.prototype;
			tree.URL = function (val, paths) {
				if (val.data) {
					this.attrs = val;
				} else {
					this.value = val;
					this.paths = paths;
				}
			};
			tree.URL.prototype = oldProto;
			String.prototype.trim=function(){
				return this.replace(/^\s+|\s+$/g, '');
			};
			Array.isArray = function(o) {
				return Object.prototype.toString.call(o) === '[object Array]'; 
			}
			Array.prototype.reduce = function(callback, opt_initialValue){
				if (null === this || 'undefined' === typeof this) {
				  // At the moment all modern browsers, that support strict mode, have
				  // native implementation of Array.prototype.reduce. For instance, IE8
				  // does not support strict mode, so this check is actually useless.
				  throw new TypeError(
					  'Array.prototype.reduce called on null or undefined');
				}
				if ('function' !== typeof callback) {
				  throw new TypeError(callback + ' is not a function');
				}
				var index = 0, length = this.length >>> 0, value, isValueSet = false;
				if (1 < arguments.length) {
				  value = opt_initialValue;
				  isValueSet = true;
				}
				for ( ; length > index; ++index) {
				  if (!this.hasOwnProperty(index)) continue;
				  if (isValueSet) {
					value = callback(value, this[index], index, this);
				  } else {
					value = this[index];
					isValueSet = true;
				  }
				}
				if (!isValueSet) {
				  throw new TypeError('Reduce of empty array with no initial value');
				}
				return value;
			};
		})(less.tree);
	}

	/**
	 * @page steal.less steal.less
	 * @parent stealjs
	 * @plugin steal/less
	 *
	 * @signature `steal('path/to/filename.less')`
	 *
	 * @param {String} path the relative path from the current file to the coffee file.
	 * You can pass multiple paths.
	 * @return {steal} returns the steal function.
	 * 
	 *
	 * @body
	 * 
	 * Lets you build and compile [http://lesscss.org/ Less ] css styles.
	 * Less is an extension of CSS that adds variables, mixins, and quite a bit more.
	 * 
	 * You can write css like:
	 * 
	 *     @@brand_color: #4D926F;
	 *     #header {
	 *       color: @@brand_color;
	 *     }
	 *     h2 {
	 *       color: @@brand_color;
	 *     }
	 * 
	 * ## Use
	 * 
	 * First, create a less file like:
	 * 
	 *     @@my_color red
	 *    
	 *     body { color:  @@my_color; }
	 *
	 *
	 * Save this in a file named `red.less`.
	 *
	 * Next, you have to add the less entry to the `stealconfig.js` file so it
	 * looks like this:
	 *
	 *     steal.config({
	 *         ext: {
	 *             less: "steal/less/less.js"
	 *         }
	 *     });
	 *
	 * This will automatically load the Less parser when the Less file is
	 * loaded. It's expected that all Less files end with `less`.
	 * 
	 * You can steal the Less file like any other file:
	 *
	 *     steal('filename.less')
	 *
	 */
	//used to convert css referencs in one file so they will make sense from prodLocation
	var convert = function( css, cssLocation, prodLocation ) {
		//how do we go from prod to css
		var cssLoc = new steal.File(cssLocation).dir(),
			newCSS = css.replace(/\@import\s+['"]?([^'"\)]*)['"]?/g, function( whole, part ) {
				//check if url is relative
				if (isAbsoluteOrData(part) ) {
					return whole
				}
				//it's a relative path from cssLocation, need to convert to
				// prodLocation
				var rootImagePath = steal.URI(cssLoc).join(part),
					fin = steal.File(prodLocation).pathTo(rootImagePath);
				return "@import '" + fin + "'";
			});
		return newCSS;
	},
	isAbsoluteOrData = function( part ) {
		return /^(data:|http:\/\/|https:\/\/|\/)/.test(part)
	};
	var lastFn,
		files = {},
		contents = {},
		abortFn,
		totalTxt = "",
		bound = false;
	var createCSS = function(cssText){
		var css = document.createElement("style");
		css.type = "text/css";
		if ( css.styleSheet ) { // IE
			css.styleSheet.cssText = cssText;
		} else {
			(function( node ) {
				if ( css.childNodes.length ) {
					if ( css.firstChild.nodeValue !== node.nodeValue ) {
						css.replaceChild(node, css.firstChild);
					}
				} else {
					css.appendChild(node);
				}
			})(document.createTextNode(cssText));
		}
		document.getElementsByTagName("head")[0].appendChild(css);
	}
	steal.type("less css", function(options, success, error){
		totalTxt += convert(options.text, options.src+'', steal.URI(steal.config().startId).dir());
		if(!bound){
			bound = true;
			steal.one("end", function(){
				files = {};
				var env = new less.tree.parseEnv({
					filename: steal.config().startId,
					files: files,
					contents: contents
				});
				// worker thread?
				new (less.Parser)(env).parse(totalTxt, function (e, root) {
					options.text = root.toCSS();
					createCSS(options.text);
				});
			})
		} 
		options.text = "";
		success();
	});
})