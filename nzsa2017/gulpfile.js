var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var reload = browserSync.reload;

var jquery = './node_modules/jquery/';
var bootstrap = './node_modules/bootstrap-sass/';
var fontawesome = './node_modules/font-awesome/';
var d3 = './node_modules/d3/build/';

var assets = './assets/';
var sassdir = assets + 'css/sass/';
var sassmain = assets + 'css/app.sass';
var scriptdir = assets + 'js/scripts/';
var vendordir = assets + 'js/vendor/';
var reveal = assets + 'revealjs/';

gulp.task('sass', function() {
    // Might need to grab some fonts:
    // gulp.src([bootstrap + 'assets/fonts/bootstrap/*'])
    //     .pipe(gulp.dest('assets/fonts/bootstrap'));
    gulp.src([fontawesome + 'fonts/*'])
        .pipe(gulp.dest(assets + 'fonts/font-awesome'));

    return sass(sassmain)
        .pipe(autoprefixer())
        .pipe(gulp.dest(assets + '/css'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('scripts', function() {
    gulp.src([jquery + 'dist/jquery.min.js',
              // bootstrap + 'assets/javascripts/bootstrap.min.js',
              reveal + 'js/reveal.js',
              reveal + 'lib/js/*.js',
              // --- add plugins as necessary
              // reveal + 'plugin/math.js',
              d3 + 'd3.min.js',
              vendordir + '*.js',
              scriptdir + '*.js'])
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(assets + '/js'));
    reload();
});

gulp.task('serve', ['sass', 'scripts'], function() {
    browserSync({
        server: {
            baseDir: ''
        },
        open: false
    });

    gulp.watch([sassmain, sassdir + '**/*.sass'], ['sass']);
    gulp.watch(scriptdir + '*.js', ['scripts']);
    gulp.watch(['*.html', 'slides/*', assets + 'js/app.min.js'], { cwd: ''}, reload);
});

gulp.task('default', ['sass', 'scripts']);
