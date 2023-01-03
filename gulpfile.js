'use strict'

import gulp from 'gulp';
import { paths, pluginOptions } from './gulp.constants.mjs';
import del from 'del';
import ejs from 'gulp-ejs';
import ejsMonster from 'gulp-ejs-monster';
import fileInclude from 'gulp-file-include';
import rename from 'gulp-rename';
import scss from 'gulp-sass';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import prettyHtml from 'gulp-pretty-html';
import nodemon from 'gulp-nodemon';
// import browserSync from 'browser-sync';


/**
 * -------------------------------------------------
 * PROCESS : METHODS
 * -------------------------------------------------
 */
const asyncDest = (obj, dest) => {
    return new Promise (resolve => {
        dest(obj);
        resolve();
    })
};
const parallelDest = async (arr, done) => {
    const promises = arr.map(item => asyncDest(item, done));
    await Promise.all(promises);
};


/**
 * -------------------------------------------------
 * PROCESS : CLEAN
 * -------------------------------------------------
 */
export const clean = () => {
    return new Promise (resolve => {
        del(paths.base.dist).then(() => resolve());
    });
}


/**
 * -------------------------------------------------
 * PROCESS : HTML - template compile
 * -------------------------------------------------
 */
export function devViews () {
    const dest = obj => {
        console.log(obj)
        gulp.src([`${obj.src}/**/*.ejs`, `!${obj.src}/**/assets/**`,`!${obj.src}/**/includes/**`], { since: gulp.lastRun(devViews) })
          .pipe(ejsMonster({}).on('error', ejsMonster.preventCrash))
          .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
          .pipe(rename({ extname: '.html' }))
          .pipe(prettyHtml())
          .pipe(rename({ dirname: '/' }))
          .pipe(gulp.dest(obj.dist));
    };

    return new Promise (resolve => {
        parallelDest(paths.compile.html, dest).then(() => resolve());
    });
}


/**
 * -------------------------------------------------
 * PROCESS : HTML - watch
 * -------------------------------------------------
 */
export function watchViews (done) {
    const watch = obj => {
        gulp.watch([`${obj.src}/**/*.*`], gulp.series(devViews));
    };

    return new Promise (resolve => {
        parallelDest(paths.compile.html, watch).then(() => {
            done();
            resolve();
        });
    });
}


/**
 * -------------------------------------------------
 * PROCESS : STYLES - compile & sourcemaps
 * -------------------------------------------------
 */
export function devStyles () {
    const dest = obj => {
        gulp.src([`${obj.src}/**/*.{css,scss}`], { sourcemaps: true, since: gulp.lastRun(devStyles) })
          .pipe(scss(pluginOptions.scss))
          .on('error', scss.logError)
          .pipe(gulp.dest(obj.dist));
    };

    return new Promise (resolve => {
        parallelDest(paths.compile.styles, dest).then(() => resolve());
    });
}


/**
 * -------------------------------------------------
 * PROCESS : STYLES - watch
 * -------------------------------------------------
 */
export function watchStyles (done) {
    const watch = obj => {
        gulp.watch(`${obj.src}/**/*.scss`, gulp.series(devStyles));
    };

    return new Promise (resolve => {
        parallelDest(paths.compile.styles, watch).then(() => {
            done();
            resolve();
        })
    });
}


/**
 * -------------------------------------------------
 * PROCESS : FONTS
 * -------------------------------------------------
 */
export function devFonts () {
    const dest = obj => {
        gulp.src(`${obj.src}/**/*.*`, { since: gulp.lastRun(devFonts) }).pipe(gulp.dest(obj.dist))
    };

    return new Promise (resolve => {
        parallelDest(paths.compile.fonts, dest).then(() => resolve());
    });
}


/**
 * -------------------------------------------------
 * PROCESS : FONTS - watch
 * -------------------------------------------------
 */
export function watchFonts (done) {
    const watch = obj => {
        gulp.watch(`${obj.src}/**/*.*`, gulp.series(devFonts));
    };

    return new Promise (resolve => {
        parallelDest(paths.compile.fonts, watch).then(() => {
            done();
            resolve();
        })
    });
}


/**
 * -------------------------------------------------
 * PROCESS : IMAGES
 * -------------------------------------------------
 */
export function devImages () {
    const dest = obj => {
        gulp.src(`${obj.src}/**/*.{jpg,jpeg,png,gif,svg,ico,mp4}`, { since: gulp.lastRun(devImages) }).pipe(gulp.dest(obj.dist))
    };

    return new Promise (resolve => {
        parallelDest(paths.compile.images, dest).then(() => resolve());
    });
}


/**
 * -------------------------------------------------
 * PROCESS : IMAGES - watch
 * -------------------------------------------------
 */
export function watchImages (done) {
    const watch = obj => {
        gulp.watch(`${obj.src}/**/*.{jpg,jpeg,png,svg,mp4}`, gulp.series(devImages));
    };

    return new Promise (resolve => {
        parallelDest(paths.compile.images, watch).then(() => {
            done();
            resolve();
        })
    });
}


/**
 * -------------------------------------------------
 * PROCESS : SCRIPTS - merger, compression, minify
 * -------------------------------------------------
 */
export function devScripts () {
    const dest = obj => {
        gulp.src(`${obj.src}/**/*.js`, { sourcemaps: true, since: gulp.lastRun(devScripts) })
          // 아래의 주석은 리펙터링을 할때 활성화
          // .pipe(babel()) // ES5 이상의 javascript 문법을 ES5 이전의 문법으로 치환(호환성 코드 polyfill 적용)
          // .pipe(uglify({ mangle: true })) // javascript minify
          // .pipe(concat('scripts.min.js')) // all javascript file > one js file
          .pipe(gulp.dest(obj.dist));
    }

    return new Promise (resolve => {
        parallelDest(paths.compile.scripts, dest).then(() => resolve());
    });
}


/**
 * -------------------------------------------------
 * PROCESS : SCRIPTS - watch
 * -------------------------------------------------
 */
export function watchScripts (done) {
    const watch = obj => {
        gulp.watch(`${obj.src}/**/*.js`, gulp.series(devScripts));
    };

    return new Promise (resolve => {
        parallelDest(paths.compile.scripts, watch).then(() => {
            done();
            resolve();
        })
    });
}


/**
 * -------------------------------------------------
 * PROCESS : VENDORS
 * -------------------------------------------------
 */
export function devVendors () {
    const dest = obj => {
        gulp.src(`${obj.src}/**/*.js`, { since: gulp.lastRun(devVendors) })
          .pipe(gulp.dest(obj.dist));
    }

    return new Promise (resolve => {
        parallelDest(paths.compile.vendors, dest).then(() => resolve());
    });
}


/**
 * -------------------------------------------------
 * PROCESS : VENDORS - watch
 * -------------------------------------------------
 */
export function watchVendors (done) {
    const watch = obj => {
        gulp.watch(`${obj.src}/**/*.js`, gulp.series(devVendors));
    };

    return new Promise (resolve => {
        parallelDest(paths.compile.vendors, watch).then(() => {
            done();
            resolve();
        })
    });
}


/**
 * -------------------------------------------------
 * PROCESS : SERVER
 * -------------------------------------------------
 */
export function server (cb) {
    let started = false;
    return new Promise (resolve => {
        nodemon(pluginOptions.nodemon)
          .on('start', () => {
              if (!started) {
                  started = true;
                  cb();
              }
          });

        resolve();
    });
}


/**
 * -------------------------------------------------
 * PROCESS : BROWSER-SYNC
 * -------------------------------------------------
 */
// function browserSyncInit(done) {
//   browserSync.init(pluginOptions.browserSync)
//   done();
// }
// gulp.task('browser-sync', browserSyncInit);


/**
 * -------------------------------------------------
 * PROCESS : DEV
 * -------------------------------------------------
 */
gulp.task('dev', gulp.parallel(devStyles, devFonts, devImages, devScripts, devVendors, devViews));


/**
 * -------------------------------------------------
 * PROCESS : WATCH
 * -------------------------------------------------
 */
gulp.task('watch', gulp.parallel(watchStyles, watchFonts, watchImages, watchScripts, watchVendors, watchViews));


/**
 * -------------------------------------------------
 * PROCESS : DEFAULT
 * -------------------------------------------------
 */
// const build = gulp.series(clean, 'dev', server, gulp.parallel('watch', 'browser-sync'));
const build = gulp.series(clean, 'dev', server);
export default build;
