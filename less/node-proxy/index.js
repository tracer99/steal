var less = require('less');
var fs = require('fs');
var url = require('url');

var configpath = "stealconfig.js";
var steal = {};
var stealconfig,opts;

//define constants
var SOURCEMAP_FILENAME = "less.source.map";

//set up steal shim
steal.config = function (config) {
	steal.config = config;
};

try{
	stealconfig = fs.readFileSync(configpath, {encoding: "utf-8"});

	//eval steal config to populate the steal namespace
	eval(stealconfig);

	opts = steal.config.less;

}catch(e){
	console.log("STEAL NODE PROXY:: ERROR:: ",e);
	throw e;
}


function createImport(path) {
	return "@import \"" + path + "\";\n";
}

function getLessString(sources){
	var imports = "";
	sources.forEach(function(source){
		imports += createImport(source);
	});
	return imports;
}

//the below function is provided to the middleware
function processLess() {

	return function processLess(request, response, next) {
		var url_parts = url.parse(request.url, true);
		var query = url_parts.query;
		var sourceMapFilename = query.uuid + "." + SOURCEMAP_FILENAME;
		var sourceMapUrl = opts.appContext + "/" + sourceMapFilename;
		var sources,lessString;

		try{
			sources = JSON.parse(query.sources);
		}catch(e){
			throw e;
		}

		function sourceMapCallback(sourceMapContent) {

			var files = fs.readdirSync(".");

			files.forEach(function(file){
				if(file.indexOf(SOURCEMAP_FILENAME) !== -1){
					console.log('cleaning up stale source map:',file);
					fs.unlinkSync(file);
				}
			});

			//write a new map
			fs.writeFileSync(sourceMapFilename, sourceMapContent);
		}

		response.setHeader('content-type', "text/css");
		response.setHeader("X-SourceMap",sourceMapUrl);

		if(sources && sources.length > 0){

			lessString = getLessString(sources);

			less.render(lessString, {

				//render options + parser options
				compress: opts.compress || true,
				sourceMap: opts.sourceMap || true,
				writeSourceMap: sourceMapCallback,
				sourceMapRootpath: "",
				sourceMapURL : sourceMapUrl

			}, function (e, css) {
				if(e){
					console.log("STEAL NODE PROXY :: ERROR :: ",e);
					throw e;
				}
				response.writeHead(200, "OK");
				response.write(css);
				response.end();
			});
		}else{
			response.writeHead(204, "No Content Available (empty source param)")
		}

	}
}

module.exports = {
	stealconfig: steal.config,
	handler: processLess
};
