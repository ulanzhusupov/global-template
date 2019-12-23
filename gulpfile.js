const gulp = require('gulp'),
      sass = require('gulp-sass'),
      browserSync = require('browser-sync'),
      autoprefixer = require('gulp-autoprefixer'),
      clean = require('gulp-clean-css'),
      newer        = require('gulp-newer'),
      rename       = require('gulp-rename'),
      responsive   = require('gulp-responsive'),
      del          = require('del');

// Gulping auto reload on save
gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  });
});
function bsReload(done) {
  browserSync.reload();
  done();
}

// Gulping styles
gulp.task('styles', function() {
  return gulp.src('app/scss/index.scss')
        .pipe(sass({
          outputStyle: 'expanded',
          includePaths: [__dirname + '/node_modules']
        }))
        .pipe(autoprefixer({
          grid: true,
          overrideBrowsersList: ['last 10 versions']
        }))
        .pipe(clean())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
});

// Gulping scripts
gulp.task('scripts', function() {
  return gulp.src('app/js/**/*.js')
        .pipe(browserSync.reload({ stream: true }));
});

// Responsive Images
var quality = 95; // Responsive images quality

// Produce @1x images
// gulp.task('img-responsive-1x', async function() {
// 	return gulp.src('app/img/_src/**/*.{png,jpg,jpeg,webp,raw}')
// 		.pipe(newer('app/img/@1x'))
// 		.pipe(responsive({
// 			'**/*': { width: '50%', quality: quality }
// 		})).on('error', function (e) { console.log(e) })
// 		.pipe(rename(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
// 		.pipe(gulp.dest('app/img/@1x'))
// });
// Produce @2x images
gulp.task('img-responsive-2x', async function() {
	return gulp.src('app/img/_src/**/*.{png,jpg,jpeg,webp,raw}')
		.pipe(newer('app/img/@2x'))
		.pipe(responsive({
			'**/*': { width: '100%', quality: quality }
		})).on('error', function (e) { console.log(e) })
		.pipe(rename(function (path) {path.extname = path.extname.replace('jpeg', 'jpg')}))
		.pipe(gulp.dest('app/img/@2x'))
});
gulp.task('img', gulp.series('img-responsive-2x', bsReload));

// Clean @*x IMG's
gulp.task('cleanimg', function() {
	return del(['app/img/@*'], { force: true })
});

// Gulping index.html
gulp.task('html', function() {
  return gulp.src('app/index.html')
        .pipe(browserSync.reload({ stream: true }));
});

// Watching files
gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', gulp.parallel('styles'));
  gulp.watch('app/js/**/*.js', gulp.parallel('scripts'));
  gulp.watch('app/index.html', gulp.parallel('html'));
  gulp.watch('app/img/_src/**/*', gulp.parallel('img'));
});

// Gulp cmd command
gulp.task('default', gulp.parallel('img','styles', 'scripts', 'browser-sync', 'watch'));