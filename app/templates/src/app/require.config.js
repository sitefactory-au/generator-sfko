// require.js looks for the following global when initializing
var require = {
    baseUrl: ".",
    paths: {
		"router":				"./app/router",
        "bootstrap":            "bower_modules/components-bootstrap/js/bootstrap.min",
        "crossroads":           "bower_modules/crossroads/dist/crossroads.min",
        "hasher":               "bower_modules/hasher/dist/js/hasher.min",
        "jquery":               "bower_modules/jquery/dist/jquery",
        "knockout":             "bower_modules/knockout/dist/knockout",
        "knockout-projections": "bower_modules/knockout-projections/dist/knockout-projections",
		"knockout-punches":     "bower_modules/knockout.punches/knockout.punches",
        "signals":              "bower_modules/js-signals/dist/signals.min",
        "text":                 "bower_modules/requirejs-text/text",
        // [Scaffolded model and module paths will be inserted here. To retain this feature, don't remove this comment.]
    },
    shim: {
        "bootstrap": { deps: ["jquery"] }
    }
};
