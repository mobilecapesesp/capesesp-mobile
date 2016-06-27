//PLUGINS//
var gulp = require('gulp'),
    shell = require('gulp-shell'),
    zip = require('gulp-zip'),
    open = require("gulp-open");

//CONFIG//
var buildBase = './build/app/',
    pluginsFolder = './plugins/**/*.*',
    appFolder = './www/**/*.*',
    buildZip = './build',
    pathPhoneGapBuild = 'C:/Quality/Projetos/Capesesp/Projeto_CAPESESP_Mobile/trunk/04_CONSTRUCAO/build/phonegapbuild/PhonegapBuild';


gulp.task('copyConfig', function () {
    return gulp.src("./config.xml")
        .pipe(gulp.dest(buildBase + "www"));
})

gulp.task('copyPlugins', function () {
    return gulp.src(pluginsFolder)
        .pipe(gulp.dest(buildBase + "plugins"));
})

gulp.task('copyApp', function () {
    return gulp.src(appFolder)
        .pipe(gulp.dest(buildBase + "www"))
});


gulp.task('prepareBuildZip', ['copyApp', 'copyPlugins','copyConfig'], function () {
    return gulp.src(buildBase + '**/*.*')
        .pipe(zip('app.zip'))
        .pipe(gulp.dest(buildZip));
});

gulp.task('build', ['prepareBuildZip'], shell.task([
    pathPhoneGapBuild
]));

gulp.task("openBuild", function () {
    gulp.src("./stubFile.html")
        .pipe(open("", {app: "google-chrome", url: "https://build.phonegap.com/apps/1215369/builds"}));
});

