/*
 * Gulp tasks:
 * 
 * default			Create full builds and distribution files for all platforms
 * build-chrome		Create a full build for Chrome
 * dist-chrome		Create a full distribution file for Chrome
 * watch-chrome		Create a full build for Chrome and automatically update it when files change
 */

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var gulp = require('gulp');
var io = require('socket.io');
var rename = require("gulp-rename");
var template = require('gulp-template');
var watch = require('gulp-watch');
var webpack = require('webpack-stream');
var ignore = require('gulp-ignore');
var getPackageDetails = require('./package-details');

// create a minified userscript for final distribution
gulp.task('script', ['script-merge-min'], function() {
	del("build/userscript");
});

// generate the script header required for userscript parsers like Greasemonkey
gulp.task('script-header', function() {
	return gulp.src('./src/userscript.head.js')
			.pipe(template(getPackageDetails()))
			.pipe(gulp.dest('./build/userscript'));
});

// minify the script
gulp.task('script-min', ['script-merge'], function(callback) {
	console.log("Minifying userscript ...");
	return gulp.src('dist/userscript/userscript.user.js')
		.pipe(uglify())
		.pipe(rename("userscript.min.js"))
		.pipe(gulp.dest("./build/userscript"));
});

// pack the script
gulp.task('script-webpack', function(callback) {
	// pack userscript
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
			.pipe(rename("userscript.code.js"))
			.pipe(gulp.dest('./build/userscript'));
});

// merge the script's head and packed body
gulp.task('script-merge', ['script-webpack', 'script-header'], function(callback) {
	return gulp.src(["./build/userscript/userscript.head.js", "./build/userscript/userscript.code.js"])
			.pipe(concat('userscript.user.js'))
			.pipe(gulp.dest("./dist/userscript"));
});

// merge the script's head and packed, minified body
gulp.task('script-merge-min', ['script-min', 'script-header'], function(callback) {
	console.log("Merging userscript header and minified code");
	return gulp.src(["./build/userscript/userscript.head.js", "./build/userscript/userscript.min.js"])
			.pipe(concat('userscript.user.min.js'))
			.pipe(gulp.dest("./dist/userscript"));
});
