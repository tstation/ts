'use strict'

const base = {
    src: 'src',
    dist: 'dist',
    distFiles: 'dist/**/*.*'
}

const paths = {
    base,
    compile: {
        styles: [
            { src: `${base.src}/prototype/assets/styles`, dist: `${base.dist}/assets/styles` },
            { src: `${base.src}/project/mobile/assets/styles`, dist: `${base.dist}/project/mobile/mc-static-root/css` },
            { src: `${base.src}/project/desktop/assets/styles`, dist: `${base.dist}/project/desktop/pc-static-root/css` }
        ],
        fonts: [
            { src: `${base.src}/prototype/assets/fonts`, dist: `${base.dist}/assets/fonts` },
            { src: `${base.src}/project/mobile/assets/fonts`, dist: `${base.dist}/project/mobile/mc-static-root/css/font` },
            { src: `${base.src}/project/desktop/assets/fonts`, dist: `${base.dist}/project/desktop/pc-static-root/css/fonts` }
        ],
        scripts: [
            { src: `${base.src}/prototype/assets/scripts`, dist: `${base.dist}/assets/scripts` },
            { src: `${base.src}/project/mobile/assets/scripts`, dist: `${base.dist}/project/mobile/mc-static-root/js/common` },
            { src: `${base.src}/project/desktop/assets/scripts`, dist: `${base.dist}/project/desktop/pc-static-root/js/common` }
        ],
        vendors: [
            { src: `${base.src}/prototype/assets/vendors`, dist: `${base.dist}/assets/vendors` },
            { src: `${base.src}/project/mobile/assets/vendors`, dist: `${base.dist}/project/mobile/mc-static-root/js/common` },
            { src: `${base.src}/project/desktop/assets/vendors`, dist: `${base.dist}/project/desktop/pc-static-root/js/common` }
        ],
        images: [
            { src: `${base.src}/prototype/assets/images`, dist: `${base.dist}/assets/images` },
            { src: `${base.src}/project/mobile/assets/images`, dist: `${base.dist}/project/mobile/mc-static-root/images` },
            { src: `${base.src}/project/desktop/assets/images`, dist: `${base.dist}/project/desktop/pc-static-root/images` }
        ],
        html: [
            { src: `${base.src}/prototype`, dist: `${base.dist}` },
            { src: `${base.src}/project/mobile`, dist: `${base.dist}/project/mobile` },
            { src: `${base.src}/project/desktop`, dist: `${base.dist}/project/desktop` }
        ]
    }
};

const pluginOptions = {
    scss: {
        /**
         * outputStyle (TYPE: String, DEFAULT: nested)
         * Values: nested, expanded, compact, compressed
         */
        outputStyle: 'expanded',

        /**
         * indentTyp (TYPE: String, DEFAULT: space)
         * Values: space, tab
         */
        indentTyp: 'tab',

        /**
         * indentWidth (TYPE: Integer, DEFAULT: 2)
         */
        indentWidth: 4,

        /**
         * precision (TYPE: Integer, DEFAULT: 5)
         */
        precision: 6,

        /**
         * sourceComments (TYPE: Boolean, DEFAULT: false)
         */
        sourceComments: true
    },
    browserSync: {
        proxy: 'localhost:3000',
        port: 5000,
        files: [base.distFiles],
        browser: 'google-chrome',
        reloadOnRestart: true,
        notify: true
    },
    nodemon: {
        script: 'app.js',
        ignore: [
            'gulpfile.js',
            'gulp.constants.mjs',
            'node_modules/'
        ]
    }
}

export { paths, pluginOptions };
