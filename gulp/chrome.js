var gulp = require('gulp');
var del = require('del');
var getPackageDetails = require('./package-details');
var io = require('socket.io');
var template = require('gulp-template');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var rename = require("gulp-rename");
var watch = require('gulp-watch');
var webpack = require('webpack-stream');
var zip = require('gulp-zip');

// web socket port for chrome auto-reload extension (https://github.com/JeromeDane/chrome-extension-auto-reload)
var WEB_SOCKET_PORT = 8890;

// generate a zip file for the chrome extension
gulp.task('chrome:dist', ['chrome:build'], function () {
	return gulp.src('build/chrome/**')
			.pipe(zip('chrome-extension-v' + getPackageDetails().version + '.zip'))
			.pipe(gulp.dest('dist/chrome'));
});

// build the chrome extension
gulp.task('chrome:build', ['chrome-manifest', 'chrome-options', 'chrome-images', 'chrome-script'], function (callback) {
	callback();
});

// Create a full build for Chrome and automatically update it when files change
gulp.task('chrome:watch', ['chrome:build', 'chrome-watch-manifest', 'chrome-watch-options'], function (callback) {
	gulp.watch('src/**/*.*', ['chrome-manifest', 'chrome-script', 'chrome-options']);

	io = io.listen(WEB_SOCKET_PORT);
	watch('./build/chrome/**', function (file) {
		console.log('change detected', file.relative);
		io.emit('file.change', {});
	});
});

// pack content script for Chrome
gulp.task('chrome-script', ['script'], function () {

	return gulp.src("./src/userscript.code.*")
		.pipe(webpack({
			module: {
				loaders: [
					{test: /\.png$/, loader: "url-loader?mimetype=image/png"},
					{test: /\.css$/, loader: 'style!css' }
				]
			},
			devtool: 'inline-source-map'
		}))
		.pipe(rename("content.js"))
		.pipe(gulp.dest('./build/chrome'));
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
