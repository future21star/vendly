'use strict';

// sass compile
import gulp from 'gulp';
import sass from 'gulp-sass';
import prettify from 'gulp-prettify';
import minifyCss from "gulp-minify-css";
import rename from "gulp-rename";
import uglify from "gulp-uglify";
import rtlcss from "gulp-rtlcss";
import connect from 'gulp-connect';
import concat from 'gulp-concat';
import babel from 'gulp-babel';
import autoprefixer from 'gulp-autoprefixer';
import plumber from 'gulp-plumber';


//*** Localhost server tast
gulp.task('localhost', function() {
    connect.server();
});

gulp.task('localhost-live', function() {
    connect.server({
        livereload: true
    });
});

//*** JS compiler task ES6 -> ES5
gulp.task('frontjs', () => {
    return gulp.src(["./app_client/js/main.js", "./app_client/js/directives.js", "!./app_client/assets/global/", "./app_client/js/**/*"])
        .pipe(plumber())
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest("./app_client/compiled"));
});


//*** SASS compiler task
gulp.task('sass', function() {
    // bootstrap compilation
    gulp.src('./sass/bootstrap.scss').pipe(sass()).pipe(gulp.dest('./assets/global/plugins/bootstrap/css/'));

    // select2 compilation using bootstrap variables
    gulp.src('./assets/global/plugins/select2/sass/select2-bootstrap.min.scss').pipe(sass({ outputStyle: 'compressed' })).pipe(gulp.dest('./assets/global/plugins/select2/css/'));

    // global theme stylesheet compilation
    gulp.src('./sass/global/*.scss').pipe(sass()).pipe(gulp.dest('./assets/global/css'));
    gulp.src('./sass/apps/*.scss').pipe(sass()).pipe(gulp.dest('./assets/apps/css'));
    gulp.src('./app_client/sass/pages/*.scss').pipe(autoprefixer({
        browsers: ['last 8 versions'],
        cascade: false
    })).pipe(sass()).pipe(concat('styles.css')).pipe(gulp.dest('./app_client/compiled'));

    // theme layouts compilation
    gulp.src('./sass/layouts/layout/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout/css'));
    gulp.src('./sass/layouts/layout/themes/*.scss').pipe(sass()).pipe(gulp.dest('./assets/layouts/layout/css/themes'));

});

//*** SASS watch(realtime) compiler task
gulp.task('sass:watch', function() {
    gulp.watch('./sass/**/*.scss', ['sass']);
});

//*** CSS & JS minify task
gulp.task('minify', function() {
    // css minify
    gulp.src(['./assets/apps/css/*.css', '!./assets/apps/css/*.min.css']).pipe(minifyCss()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/apps/css/'));

    gulp.src(['./assets/global/css/*.css', '!./assets/global/css/*.min.css']).pipe(minifyCss()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/global/css/'));
    gulp.src(['./assets/pages/css/*.css', '!./assets/pages/css/*.min.css']).pipe(minifyCss()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/pages/css/'));

    gulp.src(['./assets/layouts/**/css/*.css', '!./assets/layouts/**/css/*.min.css']).pipe(rename({ suffix: '.min' })).pipe(minifyCss()).pipe(gulp.dest('./assets/layouts/'));
    gulp.src(['./assets/layouts/**/css/**/*.css', '!./assets/layouts/**/css/**/*.min.css']).pipe(rename({ suffix: '.min' })).pipe(minifyCss()).pipe(gulp.dest('./assets/layouts/'));

    gulp.src(['./assets/global/plugins/bootstrap/css/*.css', '!./assets/global/plugins/bootstrap/css/*.min.css']).pipe(minifyCss()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/global/plugins/bootstrap/css/'));

    //js minify
    gulp.src(['./assets/apps/scripts/*.js', '!./assets/apps/scripts/*.min.js']).pipe(uglify()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/apps/scripts/'));
    gulp.src(['./assets/global/scripts/*.js', '!./assets/global/scripts/*.min.js']).pipe(uglify()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/global/scripts'));
    gulp.src(['./assets/pages/scripts/*.js', '!./assets/pages/scripts/*.min.js']).pipe(uglify()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/pages/scripts'));
    gulp.src(['./assets/layouts/**/scripts/*.js', '!./assets/layouts/**/scripts/*.min.js']).pipe(uglify()).pipe(rename({ suffix: '.min' })).pipe(gulp.dest('./assets/layouts/'));
});

//*** RTL convertor task
gulp.task('rtlcss', function() {

    gulp
        .src(['./assets/apps/css/*.css', '!./assets/apps/css/*-rtl.min.css', '!./assets/apps/css/*-rtl.css', '!./assets/apps/css/*.min.css'])
        .pipe(rtlcss())
        .pipe(rename({ suffix: '-rtl' }))
        .pipe(gulp.dest('./assets/apps/css'));

    gulp
        .src(['./assets/pages/css/*.css', '!./assets/pages/css/*-rtl.min.css', '!./assets/pages/css/*-rtl.css', '!./assets/pages/css/*.min.css'])
        .pipe(rtlcss())
        .pipe(rename({ suffix: '-rtl' }))
        .pipe(gulp.dest('./assets/pages/css'));

    gulp
        .src(['./assets/global/css/*.css', '!./assets/global/css/*-rtl.min.css', '!./assets/global/css/*-rtl.css', '!./assets/global/css/*.min.css'])
        .pipe(rtlcss())
        .pipe(rename({ suffix: '-rtl' }))
        .pipe(gulp.dest('./assets/global/css'));

    gulp
        .src(['./assets/layouts/**/css/*.css', '!./assets/layouts/**/css/*-rtl.css', '!./assets/layouts/**/css/*-rtl.min.css', '!./assets/layouts/**/css/*.min.css'])
        .pipe(rtlcss())
        .pipe(rename({ suffix: '-rtl' }))
        .pipe(gulp.dest('./assets/layouts'));

    gulp
        .src(['./assets/layouts/**/css/**/*.css', '!./assets/layouts/**/css/**/*-rtl.css', '!./assets/layouts/**/css/**/*-rtl.min.css', '!./assets/layouts/**/css/**/*.min.css'])
        .pipe(rtlcss())
        .pipe(rename({ suffix: '-rtl' }))
        .pipe(gulp.dest('./assets/layouts'));

    gulp
        .src(['./assets/global/plugins/bootstrap/css/*.css', '!./assets/global/plugins/bootstrap/css/*-rtl.css', '!./assets/global/plugins/bootstrap/css/*.min.css'])
        .pipe(rtlcss())
        .pipe(rename({ suffix: '-rtl' }))
        .pipe(gulp.dest('./assets/global/plugins/bootstrap/css'));
});

//*** HTML formatter task
gulp.task('prettify', function() {

    gulp.src('./**/*.html').
    pipe(prettify({
        indent_size: 4,
        indent_inner_html: true,
        unformatted: ['pre', 'code']
    })).
    pipe(gulp.dest('./'));
});







// ****** OLD GULP FILE *******//

//var gulp    = require('gulp');
//var concat = require('gulp-concat');
//var uglify  = require('gulp-uglify');
//var watch = require('gulp-watch');
//var sourcemaps = require('gulp-sourcemaps');
//var ngHtml2Js = require("gulp-ng-html2js");
//
//gulp.task('scripts', function() {
//  gulp.src(['./app_client/**/*.js', '!./app_client/**/*.test.js', '!./app_client/app.min.js'])
//    .pipe(sourcemaps.init())
//      .pipe(concat('./app.min.js'))
//      .pipe(uglify({mangle: true}))
//      .pipe(gulp.dest('app_client'))
//    .pipe(sourcemaps.write('./'))
//    .pipe(gulp.dest('app_client'));
//});
//
//gulp.task('watch', function() {
//  watch(['./app_client/**/*.js', '!./app_client/**/*.test.js', '!./app_client/app.min.js'], function () {
//    gulp.start('scripts');
//  });
//});
//
////gulp.task('default', ['scripts', 'watch']);
//gulp.task('default', ['scripts']);