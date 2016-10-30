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
    connectPHP = require('gulp-connect-php'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),
    browserSync = require('browser-sync');

var phpResources = "resources/views/*.blade.php";

gulp.task('watch', function(){
  gulp.watch('resources/views/*.blade.php', ['php']);
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

gulp.task('default', ['php', 'connectPHP', 'browserSync', 'watch']);
