var gulp = require('gulp');
var clean = require('gulp-clean');
var gutil = require('gulp-util');

gutil.log('stuff happened', 'Really it did', gutil.colors.cyan('123'));
gutil.beep();

gulp.task('clean', function () {
  gulp.src('build', {read: false})
    .pipe(clean());
});

gulp.task('default', function () {
    gulp.src('app/tmp/index.js')
        .pipe(clean({force: true}))
        .pipe(gulp.dest('dist'));
});