module.exports = function () {
	var webroot = "./";
	var client = "./client/";
	var config = {
		libs: client + "libs/*.js",
		plugins: client + "plugins/*.js",
		destjs: webroot + "Scripts/libs.min.js",
		css: client + "style/**/*.css",
		minCss: client + "style/**/*.min.css",
		concatCssDest: webroot + "Content/",
		tsFiles: [
			client + "app/**/*.ts"
		],
		templates: [
			client + "templates/*.html"
		],
		transpiledFiles: webroot + "Scripts/",
		templatesDest: webroot + "Templates/",
		destPath: webroot + "Scripts"
	};
	return config;
}