steal(function () {

	/*!
	 Math.uuid.js (v1.4)
	 http://www.broofa.com
	 mailto:robert@broofa.com

	 Copyright (c) 2010 Robert Kieffer
	 Dual licensed under the MIT and GPL licenses.
	 */

	/*
	 * Generate a random uuid.
	 *
	 * USAGE: Math.uuid(length, radix)
	 *   length - the desired number of characters
	 *   radix  - the number of allowable values for each character.
	 *
	 */
	(function () {
		// Private array of chars to use
		var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

		Math.uuid = function (len, radix) {
			var chars = CHARS, uuid = [], i;
			radix = radix || chars.length;

			if (len) {
				// Compact form
				for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
			} else {
				// rfc4122, version 4 form
				var r;

				// rfc4122 requires these characters
				uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
				uuid[14] = '4';

				// Fill in random data.  At i==19 set the high bits of clock sequence as
				// per rfc4122, sec. 4.1.5
				for (i = 0; i < 36; i++) {
					if (!uuid[i]) {
						r = 0 | Math.random() * 16;
						uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
					}
				}
			}

			return uuid.join('');
		};

	})();

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

	var COMPILED_FILENAME = "less.compiled.css";

	var sources = [],
		lessString,
		bound = false;

	function createImport(path) {
		return "@import \"" + path + "\";\n";
	}

	function getHref(sources) {
		var str = steal.config('less').proxyPath;
		str += "/";
		str += COMPILED_FILENAME;
		str += '?uuid=' + Math.uuid(8);
		str += "&sources=[";
		str += sources.join(',');
		str += "]";
		return str;
	}

	function createStyle(sources) {
		var tag = document.createElement('link');
		tag.setAttribute('rel', 'stylesheet');
		tag.setAttribute('type', "text/css");
		tag.setAttribute('href', getHref(sources));

		document.getElementsByTagName("head")[0].appendChild(tag);
	}

	steal.type("less css", function lessHelper(options, success) {
		var path = steal.config('root') + "/" + options.id.path;

		if (steal.isRhino) {
			lessString = createImport(options.id.path);
			options.text = lessString;
			success();

		} else {

			sources.push(JSON.stringify(path));

			//make sure this only happens once.
			if (!bound) {
				bound = true;
				steal.one("end", function () {
					createStyle(sources);
				});
			}
			options.text = "";
			success();
		}

	});
});
