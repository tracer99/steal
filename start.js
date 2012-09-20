var open = require('./lib/open');

open(process.argv[2], function(opener) {
	opener.each(function(stl) {
		console.log(stl.src.toString());
	})
})
