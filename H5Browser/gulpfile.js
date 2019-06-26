const gulp = require('gulp');
const concat = require('gulp-concat');

let concatFunc = () => {
  return gulp.src(['./js/glJs/*.js', './js/vendor/foundation.js', './js/math/*.js', './js/modules/*.js', './js/main.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('js'));
};
gulp.task('default', concatFunc);
