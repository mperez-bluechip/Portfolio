const elixir = require('laravel-elixir');

require('laravel-elixir-vue-2');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

// elixir(mix => {
//     mix.sass('app.scss')
//        .webpack('app.js');
// });

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    // compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    connectPHP = require('gulp-connect-php'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    // minifyHTML = require('gulp-minify-html'),
    // jsonminify = require('gulp-jsonminify'),
    // imagemin = require('gulp-imagemin'),
    // pngcrush = require('imagemin-pngcrush'),
    concat = require('gulp-concat');

// var env,
//     coffeeSources,
//     jsSources,
//     sassSources,
//     htmlSources,
//     jsonSources,
//     phpSources,
//     outputDir,
//     sassStyle;

var env,
    coffeeSources,
    jsSources,
    outputDir;

    env = process.env.NODE_ENV || 'development';

    if (env==='development') {
      outputDir = 'builds/development/';
      sassStyle = 'expanded';
    } else {
      outputDir = 'public/';
      sassStyle = 'compressed';
    }

coffeeSources = ['resources/coffee/tagline.coffee'];
jsSources = [
  'resources/scripts/rclick.js',
  'resources/scripts/pixgrid.js',
  'resources/scripts/tagline.js',
  'resources/scripts/template.js'
];

// sassSources = ['resources/assets/sass/app.scss'];
// htmlSources = [outputDir + '*.html'];
// phpSources = [outputDir + '*.php'];
// jsonSources = [outputDir + 'js/*.json'];

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
    .on('error', gutil.log))
    .pipe(gulp.dest('resources/scripts'))
});

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulpif(env === 'production', uglify()))
    .pipe(gulp.dest(outputDir + 'js'))
    .pipe(connect.reload())
});

// gulp.task('compass', function() {
//   gulp.src(sassSources)
//     .pipe(compass({
//       sass: 'resources/assets/sass',
//       image: outputDir + 'images',
//       style: sassStyle
//     })
//     .on('error', gutil.log))
//     .pipe(gulp.dest(outputDir + 'css'))
//     .pipe(connect.reload())
// });

// gulp.task('watch', function() {
//   gulp.watch(coffeeSources, ['coffee']);
//   gulp.watch(jsSources, ['js']);
//   gulp.watch('resources/assets/sass/*.scss', ['compass']);
//   gulp.watch('builds/development/*.html', ['html']);
//   gulp.watch('builds/development/*.php', ['php']);
//   gulp.watch('builds/development/js/*.json', ['json']);
//   gulp.watch('builds/development/images/**/*.*', ['images']);
// });

gulp.task('connect', function() {
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('connectPHP', function(){
  connect.server({
    root: outputDir,
    livereload: true
  });
});

// gulp.task('php', function(){
//   gulp.src('resources/views/*.blade.php')
//   .pipe(connect.reload())
// });

// gulp.task('html', function() {
//   gulp.src('builds/development/*.html')
//     .pipe(gulpif(env === 'production', minifyHTML()))
//     .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
//     .pipe(connect.reload())
// });

// gulp.task('images', function(){
//   gulp.src('builds/development/images/**/*.*')
//   .pipe(gulpif(env === 'production', imagemin({
//     progressive: true,
//     svgoPlugins: [{ removeViewBox: false }],
//     use: [pngcrush()]
//   })))
//   .pipe(gulpif(env === 'production', gulp.dest(outputDir + 'images')))
//   .pipe(connect.reload())
// });

// gulp.task('json', function() {
//   gulp.src('builds/development/js/*.json')
//     .pipe(gulpif(env === 'production', jsonminify()))
//     .pipe(gulpif(env === 'production', gulp.dest('builds/production/js')))
//     .pipe(connect.reload())
// });

//gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'images', 'connect', 'connectPHP', 'watch']);
gulp.task('default', ['coffee', 'js', 'connectPHP', 'connect']);
