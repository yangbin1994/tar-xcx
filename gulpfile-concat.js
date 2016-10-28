var gulp = require('gulp');
var fs = require('fs');

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

// gulp prod src dist
var srcFolderName =  process.argv[3].replace(/-/ig, '')
var distFolderName = process.argv[4].replace(/-/ig, '')


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
            if (suffix == 'wxml') {
                stream
                    .pipe(through.obj(function(file, enc, cb) {
                        if (file.isNull()) {
                            // 返回空文件
                            cb(null, file);
                        }
                        if (file.isBuffer()) {
                            file.contents = new Buffer(file.contents.toString().concat('<image src="{{tarUploadSrc}}" style="display:none;"/>'));
                        }
                        if (file.isStream()) {
                           throw new PluginError('stream not supported');
                        }
                        cb(null, file);
                    }))
            } 
            stream.pipe(gulp.dest(distFolderName + '/' + path.replace(new RegExp('.*\/*' + srcFolderName, 'ig'), '')));
        }
    })
}

gulp.task('clean', function() {
    var exec = require('child_process').exec;

    exec('rd /s/q ' + distFolderName, function(err, out) {
        console.log(out);
        err && console.log(err);
    });
})

gulp.task('prod', ['clean'], function() {
    handleFile(srcFolderName)
});
