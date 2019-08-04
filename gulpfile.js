const {src, series} = require('gulp');
const mocha = require('gulp-mocha');
const settings = {
  lint: true
}

// gulp.task('test', function() {
//   return gulp.src('test/index.js', { read: false }).pipe(mocha());
// });

const runTests = done => {
  if (!settings.lint) return done();
  return src('test/index.js', { read: false }).pipe(mocha());
}

exports.default = series(runTests)