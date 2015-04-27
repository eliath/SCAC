var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	jshintReporter = require('jshint-stylish'),
	sass = require('gulp-sass');

/*
 * Create variables for our project paths so we can change in one place
 */
var paths = {
	'js':	['./models/**/*.js','./routes/**/*.js', 'keystone.js', 'package.json'],
	'sass':	['./public/styles/**/*.scss']
};


// Lint js files
gulp.task('lint', function(){
	gulp.src(paths.js)
		.pipe(jshint())
		.pipe(jshint.reporter(jshintReporter));
});

// Compile Sass
gulp.task('sass', function() {
    gulp.src(paths.sass)
        .pipe(sass())
        .pipe(gulp.dest('public/styles/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    // gulp.watch(paths.js, ['lint']);
    gulp.watch(paths.sass, ['sass']);
});

// Default Task
gulp.task('default', [/*'lint',*/ 'sass', 'watch']);
