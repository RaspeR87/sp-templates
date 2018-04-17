var gulp = require("gulp");
var run = require("gulp-run");
var rename = require("gulp-rename");

var config = require("./gulp.config")();

gulp.task("transpile-tsx", function(){
    return run("npm run build-js").exec();
});

gulp.task("copy-files-tsx", ["transpile-tsx"], function() {
    return gulp.src(config.srcJsPath)
    .pipe(rename({
        basename: "main",
        extname: ".js"
    }))
    .pipe(gulp.dest(config.dstJsPath))
    .pipe(gulp.dest(config.spPath));
});

gulp.task("transpile-scss", function(){
    return run("npm run build").exec();
});

gulp.task("copy-files-scss", ["transpile-scss"], function() {
    return gulp.src(config.srcCssPath)
    .pipe(rename({
        basename: "main",
        extname: ".css"
    }))
    .pipe(gulp.dest(config.dstCssPath))
    .pipe(gulp.dest(config.spPath));
});

gulp.task("transpile", function(){
    return run("npm run build").exec();
});

gulp.task("copy-files", ["transpile"], function() {
    gulp.src(config.srcCssPath)
    .pipe(rename({
        basename: "main",
        extname: ".css"
    }))
    .pipe(gulp.dest(config.dstCssPath))
    .pipe(gulp.dest(config.spPath));

    return gulp.src(config.srcJsPath)
    .pipe(rename({
        basename: "main",
        extname: ".js"
    }))
    .pipe(gulp.dest(config.dstJsPath))
    .pipe(gulp.dest(config.spPath));
});

gulp.task("default", ["copy-files"], function() {
    gulp.watch(config.srcTsPath, ["copy-files-tsx"]).on("change", reportChange);
    gulp.watch(config.srcScssPath, ["copy-files-scss"]).on("change", reportChange);
});

function reportChange(event) {
    console.log("File " + event.path + " was " + event.type + ", running tasks...");
}