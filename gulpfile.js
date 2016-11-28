(function() {
  'use strict';

  var gulp = require('gulp'),
      concat = require('gulp-concat'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      sourcemaps = require('gulp-sourcemaps'),
      sassFiles = [
        './src/global.scss',
        './src/**/*.scss'
      ],
      pump = require('pump'),
      uglify = require('gulp-uglify'),
      jsFiles = ['src/**/*.js'];

  gulp.task('sass-compress', function() {
    gulp
      .src(sassFiles)
      .pipe(concat('file.scss'))
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError))
      .pipe(rename(function(path) {
        path.dirname = '';
        path.basename = 'mdl-currency-usd';
        path.extname = '.min.css';
      }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist'));
  });

  gulp.task('sass', function () {
    gulp
      .src(sassFiles)
      .pipe(concat('mdl-currency-usd.scss'))
      .pipe(sass({
        sourceComments: false
      }).on('error', sass.logError))
      .pipe(gulp.dest('./dist'));
  });

  gulp.task('js-compress', function() {
    gulp
      .src(jsFiles)
      .pipe(uglify('mdl-currency-usd.min.js', {
        outSourceMap: true
      }))
      .pipe(gulp.dest('./dist'));
  });

  gulp.task('js', function() {
    gulp
      .src(jsFiles)
      .pipe(rename(function(path) {
        path.dirname = '';
        path.basename = 'mdl-currency-usd';
        path.extname = '.js';
      }))
      .pipe(gulp.dest('./dist'));
  });

  gulp.task('watch', function () {
    gulp.watch(sassFiles, ['sass', 'sass-compress']);
    gulp.watch(jsFiles, ['js', 'js-compress']);
  });

  gulp.task('build', ['sass', 'sass-compress', 'js', 'js-compress']);

  // The default task (called when you run `gulp` from cli)
  gulp.task('default', ['watch']);

})();
