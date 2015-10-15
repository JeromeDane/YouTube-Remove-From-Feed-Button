/*
 * Gulp tasks:
 * 
 * default			Create full builds and distribution files for all platforms
 * build-chrome		Create a full build for Chrome
 * dist-chrome		Create a full distribution file for Chrome
 * watch-chrome		Create a full build for Chrome and automatically update it when files change
 */

var fs = require("fs");
var gulp = require('gulp');
var gutil = require("gulp-util");
var io = require('socket.io');
var template = require('gulp-template');
var watch = require('gulp-watch');
var webpack = require("webpack");
var zip = require('gulp-zip');

function getPackageDetails() {
	return JSON.parse(fs.readFileSync("./package.json", "utf8"));
}

// default gulp task
gulp.task('default', ['dist-chrome'], function(callback) {

});

// publish distribution for Chrome
gulp.task('dist-chrome', ['build-chrome'], function(callback) {
	// compress chrome build into a distribution zip
	return gulp.src('build/chrome/*')
        .pipe(zip('chrome-extension-v' + getPackageDetails().version + '.zip'))
        .pipe(gulp.dest('dist'));
});


// build the full chrome distribution
gulp.task('build-chrome', function(callback) {

	// pack userscript
	webpack({
		entry: "./src/userscript.user.js",
		output: {
			path: "./build/chrome",
			filename: "userscript.user.js"
		},
		module: {
			loaders: [
				{test: /\.png$/, loader: "url-loader?mimetype=image/png"},
				{test: /\.css$/, loader: 'style!css' }
			]
		},
		devtool: 'inline-source-map'
	}, function(err, stats) {
		if(err)
			throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({
			// output options
		}));
		callback();
	});

	// copy images
	gulp.src('./src/images/icon_*.*').pipe(gulp.dest('./build/chrome/images'));

	// generate chrome manifest
	gulp.src('./src/chrome/manifest.json')
			.pipe(template(getPackageDetails()))
			.pipe(gulp.dest('./build/chrome'));
	
	// generate chrome options page
	gulp.src('./src/chrome/options.html')
			.pipe(template(getPackageDetails()))
			.pipe(gulp.dest('./build/chrome'));

});

// build the full userscript distribution
gulp.task('build-userscript', function(callback) {

	// pack userscript
	webpack({
		entry: "./src/userscript.user.js",
		output: {
			path: "./build/userscript",
			filename: "userscript.user.js",
			library: "MyLibrary",
			libraryTarget: "umd"
		},
		module: {
			loaders: [
				{test: /\.png$/, loader: "url-loader?mimetype=image/png"}
			]
		}
	}, function(err, stats) {
		if(err)
			throw new gutil.PluginError("webpack", err);
		gutil.log("[webpack]", stats.toString({
			// output options
		}));
		callback();
	});

});

// Create a full build for Chrome and automatically update it when files change
gulp.task('watch-chrome', ['build-chrome'], function(callback) {
	gulp.watch('src/**/*.*', ['build-chrome']);
	
	var WEB_SOCKET_PORT = 8890;

	io = io.listen(WEB_SOCKET_PORT);

	watch('./build/chrome/**/*.js', function(file) {
		console.log('change detected', file.relative);
		io.emit('file.change', {});
	});
	
});
