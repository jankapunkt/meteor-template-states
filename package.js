/* eslint-env meteor */
Package.describe({
	name: "jkuester:template-states",
	summary: "Template states for Blaze",
	git: "https://github.com/gwendall/meteor-template-states.git",
	version: "1.0.0",
});

Package.onUse((api) => {
	api.versionsFrom(["2.16", "3.0.1"]);
	api.use(
		["ecmascript", "blaze@2.0.0||3.0.0", "reactive-dict", "templating@1.0.0"],
		"client",
	);

	api.addFiles(["lib.js"], "client");
});

Package.onTest((api) => {
  Npm.depends({
    chai: '5.2.0',
		puppeteer: '19.1.1',
  })
	api.use([
		"random",
		"ecmascript",
		"meteortesting:mocha",
	]);
	api.use(
		["blaze", "reactive-dict", "templating", "jkuester:template-states"],
		"client",
	);
	api.mainModule("lib.tests.js", "client");
});
