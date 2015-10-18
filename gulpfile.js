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
var fs = require("fs");
var gulp = require('gulp');
var gutil = require("gulp-util");
var io = require('socket.io');
var rename = require("gulp-rename");
var template = require('gulp-template');
var watch = require('gulp-watch');
var webpack = require('webpack-stream');
var zip = require('gulp-zip');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');

function getPackageDetails() {
	return JSON.parse(fs.readFileSync("./package.json", "utf8"));
}

// default gulp task
gulp.task('default', ['dist-chrome'], function(callback) {
	del("./build/userscript/userscript.body.js");
	del("./build/userscript/userscript.head.js");
	del("./build/userscript/userscript.min.js");
});

// create a minified userscript for final distribution
gulp.task('script', ['script-merge-min'], function() {
	del("build/userscript");
});

gulp.task('script-header', function() {
	return gulp.src('./src/userscript/userscript.head.js')
			.pipe(template(getPackageDetails()))
			.pipe(gulp.dest('./build/userscript'));
});

gulp.task('script-min', ['script-merge'], function(callback) {
	console.log("Minifying userscript ...");
	return gulp.src('dist/userscript/userscript.user.js')
		.pipe(uglify())
		.pipe(rename("userscript.min.js"))
		.pipe(gulp.dest("./build/userscript"));
});

gulp.task('script-webpack', function(callback) {
	// pack userscript
	return gulp.src("./src/userscript.user.*")
			.pipe(webpack({
				module: {
					loaders: [
						{test: /\.png$/, loader: "url-loader?mimetype=image/png"},
						{test: /\.css$/, loader: 'style!css' }
					]
				},
				devtool: 'inline-source-map'
			}))
			.pipe(rename("userscript.body.js"))
			.pipe(gulp.dest('./build/userscript'));
});


gulp.task('script-merge', ['script-webpack', 'script-header'], function(callback) {
	return gulp.src(["./build/userscript/userscript.head.js", "./build/userscript/userscript.body.js"])
			.pipe(concat('userscript.user.js'))
			.pipe(gulp.dest("./dist/userscript"));
});
gulp.task('script-merge-min', ['script-min', 'script-header'], function(callback) {
	console.log("Merging userscript header and minified code");
	return gulp.src(["./build/userscript/userscript.head.js", "./build/userscript/userscript.min.js"])
			.pipe(concat('userscript.user.min.js'))
			.pipe(gulp.dest("./dist/userscript"));
});

gulp.task('script-build', ['script-merge'], function(callback) {
	callback();
});

gulp.task('chrome-images', function() {
	return gulp.src('./build/chrome/images/icon_*.*')
			.pipe(gulp.dest('./build/chrome/temp/images'));
});

gulp.task('clean', function(callback) {
	del('build');
	del('dist');
	callback();
});

// pre-copy and minify chrome distribution files before zipping them
gulp.task('dist-chrome-pre', ['build-chrome'], function(callback) {
	
	// copy files to temporary directory
	gulp.src('./build/chrome/**').pipe(gulp.dest('./build/chrome/temp'));
	
	// copy images to temporary directory
	//gulp.src('./build/chrome/images/icon_*.*').pipe(gulp.dest('./build/chrome/temp/images'));
	
	callback();
	
});

// publish distribution for Chrome
gulp.task('dist-chrome', ['build-chrome'], function(callback) {
	
	
	// copy files to temporary directory
	console.log('Copying chrome build to temporary ...');
	gulp.src('./build/chrome/**').pipe(gulp.dest('./build/chrome/temp'));
	
	// copy images to temporary directory
	//gulp.src('./build/chrome/images/icon_*.*').pipe(gulp.dest('./build/chrome/temp/images'));
	
	console.log('zipping chrome files');
	// compress chrome build into a distribution zip
	gulp.src('build/chrome/temp/**')
        .pipe(zip('chrome-extension-v' + getPackageDetails().version + '.zip'))
        .pipe(gulp.dest('dist'));

	del('build/chrome/temp');

	callback();
});

// build the full chrome distribution
gulp.task('build-chrome', ['script-build', 'chrome-images'], function(callback) {

	// generate chrome manifest
	gulp.src('./src/chrome/manifest.json')
			.pipe(template(getPackageDetails()))
			.pipe(gulp.dest('./build/chrome'));
	
	// generate chrome options page
	gulp.src('./src/chrome/options.html')
			.pipe(template(getPackageDetails()))
			.pipe(gulp.dest('./build/chrome'));

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
	watch('./build/chrome/**/*.json', function(file) {
		console.log('change detected', file.relative);
		io.emit('file.change', {});
	});
	
});
