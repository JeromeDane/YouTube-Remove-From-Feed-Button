var gulp = require('gulp');
var del = require('del');
var getPackageDetails = require('./package-details');
var template = require('gulp-template');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');


// build the chrome extension
gulp.task('chrome-build', ['script', 'chrome-manifest', 'chrome-images'], function () {



});

// generate the chrome manifest from the template
gulp.task('chrome-manifest', function () {
	return gulp.src('src/chrome/manifest.json')
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

// pre-copy and minify chrome distribution files before zipping them
gulp.task('dist-chrome-pre', ['build-chrome'], function (callback) {

	// copy files to temporary directory
	gulp.src('./build/chrome/**').pipe(gulp.dest('./build/chrome/temp'));

	// copy images to temporary directory
	//gulp.src('./build/chrome/images/icon_*.*').pipe(gulp.dest('./build/chrome/temp/images'));

	callback();

});

// publish distribution for Chrome
gulp.task('dist-chrome', ['build-chrome'], function (callback) {


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
gulp.task('build-chrome', ['script-build', 'chrome-images'], function (callback) {

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
gulp.task('watch-chrome', ['build-chrome'], function (callback) {
	gulp.watch('src/**/*.*', ['build-chrome']);

	var WEB_SOCKET_PORT = 8890;

	io = io.listen(WEB_SOCKET_PORT);

	watch('./build/chrome/**/*.js', function (file) {
		console.log('change detected', file.relative);
		io.emit('file.change', {});
	});
	watch('./build/chrome/**/*.json', function (file) {
		console.log('change detected', file.relative);
		io.emit('file.change', {});
	});

});
