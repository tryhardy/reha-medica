const { src, dest, task, series, watch, parallel } = require("gulp");
const clean = require('gulp-clean');
const minify = require('gulp-minifier');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const sassGlob = require('gulp-sass-glob');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const autoprefixer = require('gulp-autoprefixer');
const px2rem = require('gulp-smile-px2rem');
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;
const pug = require('gulp-pug');
const svgo = require('gulp-svgo');
const svgSprite = require('gulp-svg-sprite');
const { SRC_PATH, DIST_PATH, STYLES_LIBS, JS_LIBS } = require('./gulp.config');
var gulpif = require('gulp-if');
const env = process.env.NODE_ENV;

/*массив стилей для таска*/
const styles = [
  ...STYLES_LIBS,
  'src/styles/main.scss'
];
/*массив сскриптов для таска*/
const libs = [
  ...JS_LIBS,
  'src/js/*.js'
];

task('clean', () => {
  return src(`${DIST_PATH}/**/*`, { read: false }).pipe(clean());
});

task('copy:html', () => {
    return src(`${SRC_PATH}/*.html`)
    .pipe(dest(`${DIST_PATH}`))
    .pipe(reload({stream:true}));
});

task('copy:img', () => {
  return src(`${SRC_PATH}/images/**/*`)
  .pipe(dest(`${DIST_PATH}/images`))
  .pipe(reload({stream:true}));
});

task('pug', function buildHTML() {
  return src(`${SRC_PATH}/*.pug`)
  .pipe(pug({

  }))
  .pipe(dest(`${DIST_PATH}`))
  .pipe(reload({stream:true}));
});

task('styles', () => {
  return src(styles)
  .pipe(gulpif(env === 'dev', sourcemaps.init()))
  .pipe(concat('main.min.scss'))
  .pipe(sassGlob())
  .pipe(sass().on('error', sass.logError))
  .pipe(gulpif(env === 'prod', gcmq()))
  .pipe(autoprefixer({
    overrideBrowserslist:["last 2 versions"],
    cascade: false
  }))
  /*.pipe(px2rem())*/
  .pipe(gulpif(env === 'prod', cleanCSS({compatibility: 'ie8'})))
  .pipe(gulpif(env === 'prod', minify({
    minify: true,
    minifyCSS: true
  })))
  .pipe(gulpif(env === 'dev', sourcemaps.write()))
  .pipe(dest(`${DIST_PATH}/styles`))
  .pipe(reload({stream:true}));
});

task('scripts', () => {
  return src(libs)
  .pipe(gulpif(env === 'dev', sourcemaps.init()))
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(gulpif(env === 'dev', sourcemaps.write()))
  .pipe(dest(`${DIST_PATH}/js`))
  .pipe(reload({stream:true}));
});

task('server', function() {
  browserSync.init({
      server: {
          baseDir: `./${DIST_PATH}`
      },
      open: false
  });
});

task('svg', () => {
  return src(`${SRC_PATH}/icons/*.svg`)
    .pipe(svgo({
      plugins: [
        {
          removeAttrs: {
            attrs: '(fill|stroke|style|width|height|data.*)'
          }
        }
      ]
    }))
    .pipe(dest(`${DIST_PATH}/images/icons`));
 });

if(env === 'dev') {
  watch(`./${SRC_PATH}/**/*`, series("styles"));
  watch(`./${SRC_PATH}/**/*`, series("copy:html"));
  watch(`./${SRC_PATH}/**/*`, series("scripts"));
  watch(`./${SRC_PATH}/**/*`, series("pug"));
  watch(`./${SRC_PATH}/images/*`, series("copy:img"));
}

task("default", series("clean", parallel("pug", "styles", "scripts", 'svg', 'copy:img'), "server"));

task("build", series("clean", parallel("pug", "styles", "scripts", 'svg', 'copy:img')));