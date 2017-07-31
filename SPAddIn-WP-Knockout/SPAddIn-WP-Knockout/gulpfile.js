var _spSite = "[your-spaddin-url]";

var gulp = require("gulp");
var $ = require("gulp-load-plugins")({lazy: true});
var spsave = require("gulp-spsave");

var config = require("./gulp.config")();
var tsconfig = require("./tsconfig.json");
var creds = require("./spsavecreds.js");

gulp.task("default", ["min-js", "transpile"], function () {
    gulp.watch(config.tsFiles, ["transpile"]).on("change", reportChange);
	gulp.watch(config.js, ["min-js"]).on("change", reportChange);
});

gulp.task("min-js", function () {
    return gulp.src([config.libs, config.plugins])
		.pipe($.plumber())
        .pipe($.concat(config.destjs))
		.pipe($.uglify())
        .pipe(gulp.dest("."))
		.pipe(spsave({
			siteUrl: _spSite,
			folder: "Scripts"
		},creds))
});

gulp.task("transpile", function () {
    return gulp
		.src(config.tsFiles)
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.typescript(tsconfig.compilerOptions))
		.pipe($.babel())
		.pipe($.uglify())
		.pipe($.sourcemaps.write("."))
		.pipe(gulp.dest(config.transpiledFiles))
		.pipe(spsave({
			siteUrl: _spSite,
			folder: "Scripts",
			flatten: false
		},creds))
});

gulp.task("copy-templates", function(){
	return gulp
		.src(config.templates)
		.pipe(gulp.dest(config.templatesDest))
		.pipe(spsave({
			siteUrl: _spSite,
			folder: "Templates"
		},creds));
});

function reportChange(event) {
    console.log("File " + event.path + " was " + event.type + ", running tasks...");
}