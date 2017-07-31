var gulp = require("gulp");
var $ = require("gulp-load-plugins")({lazy: true});

var config = require("./gulp.config")();
var tsconfig = require("./tsconfig.json");

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
		.pipe(gulp.dest("C:\\Program Files\\Common Files\\microsoft shared\\Web Server Extensions\\16\\TEMPLATE\\"))
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
		.pipe(gulp.dest("C:\\Program Files\\Common Files\\microsoft shared\\Web Server Extensions\\16\\TEMPLATE\\LAYOUTS\\" + config.hiveName + "\\script\\"));
});

gulp.task("copy-templates", function(){
	return gulp
		.src(config.templates)
		.pipe(gulp.dest(config.templatesDest))
		.pipe(gulp.dest("C:\\Program Files\\Common Files\\microsoft shared\\Web Server Extensions\\16\\TEMPLATE\\LAYOUTS\\" + config.hiveName + "\\templates\\"));
});

function reportChange(event) {
    console.log("File " + event.path + " was " + event.type + ", running tasks...");
}