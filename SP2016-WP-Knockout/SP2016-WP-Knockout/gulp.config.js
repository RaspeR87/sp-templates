module.exports = function () {
	var hiveName = "SP2016-WP-Knockout"
	var webroot = "./Layouts/" + hiveName + "/";
	var client = "./client/";
	var config = {
		hiveName: hiveName,
		libs: client + "libs/*.js",
		plugins: client + "plugins/*.js",
		destjs: webroot + "script/libs.min.js",
		css: client + "style/**/*.css",
		minCss: client + "style/**/*.min.css",
		concatCssDest: webroot + "style/",
		tsFiles: [
			client + "app/**/*.ts"
		],
		templates: [
			client + "templates/*.html"
		],
		transpiledFiles: webroot + "script/",
		templatesDest: webroot + "templates/",
		destPath: webroot + "script"
	};
	return config;
}