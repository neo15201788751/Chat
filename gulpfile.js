'use strict';
var gulp = require('gulp'),
	del = require('del');

gulp.task('bower', function () {
    var bower = require('main-bower-files'),
		bowerNormalizer = require('gulp-bower-normalize'),
		destDir = './client/app/lib/';

    del(destDir);

    return gulp.src(bower(), {
        base: './bower_components'
    })
        .pipe(bowerNormalizer({
            bowerJson: './bower.json',
            flatten: false
        }))
        .pipe(gulp.dest(destDir));
});
gulp.task('default', ['bower'], function () {
});