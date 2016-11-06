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

elixir(mix => {
    mix.sass('app.scss')
       .webpack('app.js');
});

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    connectPHP = require('gulp-connect-php'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    jsonminify = require('gulp-jsonminify'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    livereload = require('gulp-livereload'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    // htmlSources,
    phpResources,
    jsonSources,
    outputDir,
    sassStyle;

env = process.env.NODE_ENV || 'development';

if(env === 'development'){
  outputDir = 'builds/'
  sassStyle = 'expanded'
}else{
  outputDir = 'public/'
  sassStyle = 'compressed'
}

coffeeSources = ['resources/coffee/tagline.coffee'];
jsSources = [
  'resources/scripts/rclick.js',
  'resources/scripts/pixgrid.js',
  'resources/scripts/tagline.js',
  'resources/scripts/template.js',
  'resources/scripts/jquery.countTo.js',
  'resources/scripts/jquery.easing.1.3.js',
  'resources/scripts/magnific-popup-options.js',
  'resources/scripts/main.js'
];
sassSources = ['resources/assets/sass/style.scss'];
// htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
    .on('error', gutil.log))
    .pipe(gulp.dest('resources/scripts'))
});

gulp.task('js', function(){
  gulp.src(jsSources)
  .pipe(concat('script.js'))
  .pipe(browserify())
  .pipe(gulpif(env === 'production', uglify()))
  .pipe(gulp.dest(outputDir + 'js'))
  .pipe(connect.reload())
});

gulp.task('compass', function(){
  gulp.src(sassSources)
  .pipe(compass({
    sass: 'resources/assets/sass',
    // image: outputDir + 'img',
    style: sassStyle
  })
  .on('error', gutil.log))
  .pipe(gulp.dest(outputDir + 'css'))
  .pipe(connect.reload())
});

gulp.task('watch', function(){
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('resources/assets/sass/*scss', ['compass']);
  gulp.watch('resources/views/*.blade.php', ['php']);
  gulp.watch('resources/assets/js/*.json', ['json'])
});

gulp.task('connect', function(){
  connect.server({
    root: outputDir,
    livereload: true
  });
});

gulp.task('php', function(){
  gulp.src('resources/views/*.blade.php')
  .pipe(connect.reload({stream:true}))
});

gulp.task('connectPHP', function(){
  connectPHP.server({
    base: 'resources/views',
    host: 'localhost',
    hostname: '127.0.0.1',
    bin: '/Applications/MAMP/bin/php/php7.0.8/bin/php',
    ini: '/Applications/MAMP/bin/php/php7.0.8/conf/php.ini',
    livereload: true
  });
});

gulp.task('browserSync',['connectPHP'], function(){
  browserSync({
    proxy: {
    target: 'resources/' + phpResources
  },
    port: 8080,
    open: true
  });
});

gulp.task('json', function(){
  gulp.src('resources/assets/js/*.json')
  .pipe(gulpif(env === 'production', jsonminify()))
  .pipe(gulpif(env === 'production', gulp.dest('public/js')))
  .pipe(connect.reload())
});

gulp.task('default', ['php', 'json', 'coffee', 'js', 'compass', 'connect', 'connectPHP', 'browserSync', 'watch']);
