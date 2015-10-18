var gulp = require('gulp');
var del = require('del');
var getPackageDetails = require('./package-details');
var template = require('gulp-template');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var rename = require("gulp-rename");
var zip = require('gulp-zip');

// web socket port for chrome auto-reload extension (https://github.com/JeromeDane/chrome-extension-auto-reload)
var WEB_SOCKET_PORT = 8890;

// generate a zip file for the chrome extension
gulp.task('chrome', ['chrome-build'], function () {
	return gulp.src('build/chrome/**')
			.pipe(zip('chrome-extension-v' + getPackageDetails().version + '.zip'))
			.pipe(gulp.dest('dist/chrome'));
});

// build the chrome extension
gulp.task('chrome-build', ['script', 'chrome-manifest', 'chrome-options', 'chrome-images', 'chrome-script'], function (callback) {
	callback();
});

// copy userscript to chrome build directory
gulp.task('chrome-script', ['script'], function () {
	return gulp.src('dist/userscript/userscript.user.min.js')
			.pipe(rename('userscript.user.js'))
			.pipe(gulp.dest('build/chrome'));
});

// generate the chrome manifest from the template
gulp.task('chrome-manifest', function () {
	return gulp.src('src/chrome/manifest.json')
			.pipe(template(getPackageDetails()))
			.pipe(gulp.dest('build/chrome'));
});

// generate the chrome manifest from the template
gulp.task('chrome-options', function () {
	return gulp.src('src/chrome/options.html')
			.pipe(template(getPackageDetails()))
			.pipe(gulp.dest('build/chrome'));
});

gulp.task('chrome-images', function () {
	// copy the images into the chrome folder
	var images = gulp.src('src/images/**')
			.pipe(imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngquant()]
			}))
			.pipe(gulp.dest("build/chrome/images"));
});

// listen for changes to manifest
gulp.task('chrome-watch-manifest', function() {
	gulp.watch('src/chrome/manifest.json', ['chrome-manifest']);
});

// listen for changes to options
gulp.task('chrome-watch-options', function() {
	gulp.watch('src/chrome/options.html', ['chrome-options']);
});

// listen for changes to options
gulp.task('chrome-watch-script', function() {
		gulp.watch('src/userscript/*.*', ['chrome-script']);
});

// Create a full build for Chrome and automatically update it when files change
gulp.task('chrome-watch', ['chrome-build', 'chrome-watch-manifest', 'chrome-watch-options'], function (callback) {
	gulp.watch('src/**/*.*', ['chrome-manifest', 'chrome-script', 'chrome-options']);

	io = io.listen(WEB_SOCKET_PORT);
	watch('./build/chrome/**', function (file) {
		console.log('change detected', file.relative);
		io.emit('file.change', {});
	});
});

