var Zombie = require("zombie")

// Methods for walking through steal and its dependencies

// which steals have been touched in this cycle
var touched = {};

//recursively goes through dependencies
// stl - a steal
// CB - a callback for each steal
// depth - true if it should be depth first search, defaults to breadth
// includeFns - true if it should include functions in the iterator
var iterate = function (stl, CB, depth, includeFns) {
	// load each dependency until
	var i = 0,
		depends = stl.dependencies.slice(0);

	while (i < depends.length) {
		if (depends[i] === null || depends[i].waits) {
			// once we found something like this ...
			// if(includeFns){
			// var steals = depends.splice(0,i+1),
			// curStl = steals[steals.length-1];
			// } else {
			// removes all steals before the wait
			var steals = depends.splice(0, i),
			// cur steal is the waiting dependency
				curStl = depends.shift();
			// }

			// load all these steals, and their dependencies
			loadset(steals, CB, depth, includeFns);

			if (curStl) { // curStl can be null
				if (depth) {
					// load any dependencies
					loadset(curStl.dependencies, CB, depth, includeFns);
					// probably needs to change if depth
					touch([curStl], CB)
				} else {
					touch([curStl], CB);
					loadset(curStl.dependencies, CB, depth, includeFns);
				}
			}
			i = 0;
		} else {
			i++;
		}
	}

	// if there's a remainder, load them
	if (depends.length) {
		loadset(depends, CB, depth, includeFns);
	}

}

// loads each steal 'in parallel', then
// loads their dependencies one after another
var loadset = function (steals, CB, depth, includeFns) {
	// doing depth first
	if (depth) {
		// do dependencies first
		eachSteal(steals, CB, depth, includeFns)

		// then mark
		touch(steals, CB);
	} else {
		touch(steals, CB);
		eachSteal(steals, CB, depth, includeFns)
	}
}

var touch = function (steals, CB) {
	for (var i = 0; i < steals.length; i++) {
		if (steals[i]) {
			var uniqueId = steals[i].options.id;
			//print("  Touching "+uniqueId )
			if (!touched[uniqueId]) {
				CB(steals[i]);
				touched[uniqueId] = true;
			}
		}


	}
}

var eachSteal = function (steals, CB, depth, includeFns) {
	for (var i = 0; i < steals.length; i++) {
		iterate(steals[i], CB, depth, includeFns)
	}
}

var open = module.exports = function (url, cb, includeFns) {
	Zombie.visit(url,
		{ debug : true }, function (e, browser, status) {
		var window = browser.document.window;
		// what gets called by steal.done
		// rootSteal the 'master' steal
		var doneCb = function (rootSteal) {
			// get the 'base' steal (what was stolen)

			// callback with the following
			cb({
				/**
				 * @hide
				 * Goes through each steal and gives its content.
				 * How will this work with packages?
				 *
				 * @param {Function} [filter] the tag to get
				 * @param {Boolean} [depth] the tag to get
				 * @param {Object} func a function to call back with the element and its content
				 */
				each : function (filter, depth, func) {
					// reset touched
					touched = {};
					// move params
					if (!func) {

						if (depth === undefined) {
							depth = false;
							func = filter;
							filter = function () {
								return true;
							};
						} else if (typeof filter == 'boolean') {
							func = depth;
							depth = filter
							filter = function () {
								return true;
							};
						} else if (arguments.length == 2 && typeof filter == 'function' && typeof depth == 'boolean') {
							func = filter;
							filter = function () {
								return true;
							};
						} else {  // filter given, no depth
							func = depth;
							depth = false;

						}
					};

					// make this filter by type
					if (typeof filter == 'string') {
						var resource = filter;
						filter = function (stl) {
							return stl.options.buildType === resource;
						}
					}
					var items = [];
					// iterate
					iterate(rootSteal, function (resource) {
						if (filter(resource)) {
							// resource.options.text = resource.options.text || loadScriptText(resource);
							func(resource.options, resource);
							items.push(resource.options);
						}
					}, depth, includeFns || false);
				},
				// the
				steal : window.steal,
				url : url,
				rootSteal : rootSteal
				// firstSteal : s.build.open.firstSteal(rootSteal)
			})
		};

		window.steal.one('done', doneCb);
	});
}
