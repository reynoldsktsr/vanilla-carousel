var gulp = require('gulp');
var del = require('del');
var browsersync = require('browser-sync').create();

var babel = require('gulp-babel');
var cleancss = require('gulp-clean-css');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var terser = require('gulp-terser');
var uglify = require('gulp-uglify');

sass.compiler = require('node-sass');
var reload = browsersync.reload;

var paths = {
  html: {
    src: 'src/**/*.html',
    dest: 'dist'
  },
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/assets/images/**',
    dest: 'dist/images/'
  }
};

clean = () => {
  return del(['dist']);
}

html = () => {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest));
}
scripts = () => {
  return gulp.src(paths.scripts.src)
    .pipe(babel({presets: ['@babel/preset-env']}))
    .pipe(concat('site.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}
styles = () => {
  return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleancss())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream());
}
images = () => {
  return gulp.src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest));

}

function serve() {
  browsersync.init({
    server: {
      baseDir: './dist/'
    },
    port: 3131
  });
  gulp.watch(paths.html.src, html).on('change', reload);
  gulp.watch(paths.scripts.src, scripts).on('change', reload);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.images.src, images);
}

var build = gulp.series(clean, gulp.parallel(html, styles, scripts, images))

exports.clean = clean;
exports.html = html;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.default = build;
exports.serve = serve;
