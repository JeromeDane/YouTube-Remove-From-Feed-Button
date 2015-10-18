require('./gulp/script');
require('./gulp/chrome');
var gulp = require('gulp');
var del = require('del');

// remove all build and distribution files
gulp.task('clean', function(callback) {
	del('build');
	del('dist');
	callback();
});