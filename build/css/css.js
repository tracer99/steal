if(!steal.build){
	steal.build = {};	
}
steal('steal',function( steal ) {
	/**
	 * @class steal.build.css
	 * @parent steal.build
	 * @hide
	 */
	var css = steal.build.css = {};
	/**
	 * @function steal.build.css.makePackage
	 * @parent steal.build.css
	 * 
	 * @signature `css(steals, where)`
	 *
	 * @param {{}} steals
	 * @param {{Object}} where
	 */
	css.makePackage = function(steals, where){
        var cssString;

		if(!steals || !steals.length){
			return null;
		}
		
		var directory = steal.File(where).dir(),
			srcs = [], codez = [];
		
        if(steal.config('ext')['less']){

			steals.forEach(function(options){
				codez.push(options.text);
				srcs.push(options.rootSrc+'');
			});

			cssString = codez.join('\n');

			function renderLess(cssString){
				var rnd = Math.floor(Math.random() * 1000000 + 1),
					filename = "tmp" + rnd + ".less",
					oFilename = filename + '.out',
					tmpfile = new steal.URI(filename),
					outfile = new steal.URI(oFilename),
					outputString;

				tmpfile.save(cssString);

				runCommand("steal/node_modules/less/bin/lessc", filename, "-x", "--clean-css", oFilename);

				outputString = readFile(oFilename,"utf-8");

				tmpfile.remove();
				outfile.remove();

				return outputString;
			}

			return {
				srcs : srcs,
				code : renderLess(cssString)
			};

        }else{
			steals.forEach(function(stealOpts){
				codez.push(convert(stealOpts.text, stealOpts.id, directory));
				srcs.push(stealOpts.rootSrc+'')
			});

			cssString = codez.join('\n');

			return {
				srcs: srcs,
				code : css.minify(cssString)
			}
		}
		

	};
	//used to convert css references in one file so they will make sense from prodLocation
	var convert = function( css, cssLocation, prodLocation ) {
		//how do we go from prod to css
		var cssLoc = new steal.File(cssLocation).dir(),
			newCSS = css.replace(/url\(['"]?([^'"\)]*)['"]?\)/g, function( whole, part ) {

				//check if url is relative
				if (isAbsoluteOrData(part) ) {
					return whole
				}
				//it's a relative path from cssLocation, need to convert to
				// prodLocation
				var rootImagePath = steal.URI(cssLoc).join(part),
					fin = steal.File(prodLocation).pathTo(rootImagePath);
				return "url(" + fin + ")";
			});
		return newCSS;
	},
	isAbsoluteOrData = function( part ) {
		return /^(data:|http:\/\/|https:\/\/|\/)/.test(part)
	},
    calcSavings = function(raw_len, minified_len) {
        var diff_len = raw_len - minified_len, x = Math.pow(10,1);
        return 'Compressed: '+(Math.round((diff_len/raw_len*100)*x)/x)+'%  Before: '+
            string2size(raw_len)+'  After: '+string2size(minified_len);
    },
    string2size = function(bytes) {
        var s = ['bytes','kb','mb','gb','tb','pb'];
        var e = Math.floor(Math.log(bytes)/Math.log(1024));
        return (bytes/Math.pow(1024,Math.floor(e))).toFixed(1)+' '+s[e];
    };
},'steal/build/css/cssminify.js');
