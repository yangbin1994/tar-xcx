var gulp = require('gulp');
var minify = require('gulp-uglify');
var fs = require('fs');
var watch = require('gulp-watch');
var less = require('gulp-less');
var mincss = require('gulp-clean-css');
var babel = require("gulp-babel");
var rename = require('gulp-rename');
var cheerio = require('cheerio');

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

var __DEV__ = false,
    num = 0;

function handleFile(path) {
    var dirs = fs.readdirSync(path);
    dirs.forEach(function(item, idx) {
        var path2 = path + '/' + dirs[idx];
        var suffix = dirs[idx].split('.')[1];
        if (fs.lstatSync(path2).mode & 0040000) {
            // 是文件夹
            handleFile(path2)
        } else {
            var stream = gulp.src(path2);
            if (suffix == 'js') {
                stream.pipe(babel());
                if (!__DEV__)
                    stream.pipe(minify())
            } else if (suffix == 'less') {
                stream
                    .pipe(rename({
                        extname: '.wxss'
                    }))
                    .pipe(less())
                    .pipe(mincss())

            } else if (suffix == 'wxml') {
                stream
                    .pipe(through.obj(function(file, enc, cb) {
                        if (file.isNull()) {
                            // 返回空文件
                            cb(null, file);
                        }
                        if (file.isBuffer()) {
                            file.contents = new Buffer(file.contents.toString().concat('<image src="{{tarUploadSrc}}" style="display:none;"/>'));
                        }
                        if (file.isStream()) {}
                        cb(null, file);
                    }))
            } else {
                stream;
            }
            stream.pipe(gulp.dest('dist/' + path.replace(/.*\/*src/ig, '')));
        }
    })
}

gulp.task('clean', function() {
    var exec = require('child_process').exec;

    exec('rd /s/q dist', function(err, out) {
        console.log(out);
        err && console.log(err);
    });
})

gulp.task('prod', ['clean'], function() {
    handleFile('./src')
});

gulp.task('dev', ['clean'], function() {
    __DEV__ = true;
    handleFile('./src')
    watch('./src', function() {
        console.log('handling...', num++)
        handleFile('./src')
        console.log('ok')
    });
})
