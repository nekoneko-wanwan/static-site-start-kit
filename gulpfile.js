/* 必須 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

/* サーバ関係 */
var browserSync = require('browser-sync').create();
var ssi         = require('browsersync-ssi');

/* jsの結合を行う場合に必要 */
var browserify  = require('browserify');
var buffer      = require('vinyl-buffer');
var source      = require('vinyl-source-stream');
var glob        = require('glob');



/********************************
 * path定義
 * - ROOT : ドキュメントルートのパス
 * - CSS  : コンパイルするscssと出力するディレクトリ
 * - JS   : コンパイルするjsと出力するディレクトリ
 * - WATCH: ライブリロード用の監視ファイル
 * - GUIDE: スタイルガイドを出力するディレクトリ
 ********************************/
var ROOT = './root/';
var CSS = {
  SRC     : ROOT + 'common/_src/scss/**/*.scss',
  SRC_DIR : ROOT + 'common/_src/scss/',
  DST_DIR : ROOT + 'common/css/',
  DOC_ROOT: '/common/css/',
};
var JS = {
  SRC     : ROOT + 'common/_src/js/**/*.js',
  SRC_DIR : ROOT + 'common/_src/js/',
  DST_DIR : ROOT + 'common/js/',
  DOC_ROOT: 'common/js'
};
var WATCH = [
  CSS.DST_DIR + '*.css',
  JS.DST_DIR  + '*.js',
  ROOT + '**/*.html'
];
var GUIDE =  ROOT + '_guide/';


/********************************
 * task定義
 * - server : 静的サーバの構築(SSI付き)
 * - sass   : sassファイルのコンパイル（autoprefix, csscomb）
 * - guide  : スタイルガイドの出力
 * - js     : browserifyとuglifyを使った結合
 * - watch  : ライブリロード（使用しないものは無効に）
 * - default: 使用しないものは無効に
 * - del_   : コンパイルされたファイルを全て削除する
 ********************************/
gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: ROOT,
      directory: false,
      middleware: [
        ssi({
          baseDir: __dirname + '/' + ROOT,  // サーバからのパスに注意
          ext: ".html"
        }),
        function(req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          next();
        }
      ],
    },
    open: false,
    port: 9999
  });
});


gulp.task('sass', function () {
  return $.rubySass(CSS.SRC, {
      style: 'expanded',
      stopOnError: false,
      cacheLocation: './sass-cache'
    })
    .pipe($.plumber())
    .pipe($.autoprefixer({
        browsers: ['last 2 versions', 'ie 9', 'ios 6', 'android 4'],
        cascade: false
    }))
    .pipe($.csscomb())  // もし重たくなってきたら場合は別タスク化
    .pipe(gulp.dest(CSS.DST_DIR))

    // ガイド生成用に別途concatしてdestしておく
    .pipe($.concat('style.css'))
    .pipe($.minifyCss())
    .pipe(gulp.dest(GUIDE));  // publicの中だと書き換えられてしまうため、ひとつ上に出す
});


/* kss-nodeを利用したガイド生成 */
gulp.task('guide', $.shell.task([
    'kss-node <%= source %> --homepage <%= mdFile%> <%= destination %> --template <%= template%> --css <%= cssfile %>'
  ], {
    templateData: {
      source: CSS.SRC_DIR,  // ファイルを直接指定だと動かない
      mdFile: 'styleguide-intro.md', // scssファイル内に含む
      destination: GUIDE,
      template: './kss-template/',
      cssfile: CSS.DOC_ROOT + 'style.css'  // ドキュメントルートからの位置になることに注意
    }
  }
));


gulp.task('js', function(){
  var srcFiles = glob.sync(JS.SRC);
  return browserify({
    entries: srcFiles
  })
  // エラーが出ても止めない
  .bundle().on('error', function(err) {
      console.log('ERROR! \n' + err.message);
      this.emit('end');
  })
  .pipe(source('app.js'))  // 出力ファイル名
  .pipe(buffer())  // uglifyする時には必須
  // .pipe($.uglify())  // 圧縮（使用しない変数関数は出力しない。多分）
  .pipe(gulp.dest(JS.DST_DIR));
});


gulp.task('watch', function() {
  var timer;
  gulp.watch(CSS.SRC, ['sass']);
  // gulp.watch(JS.SRC,  ['js']);

  gulp.watch(WATCH).on('change',  function() {
    /* 連続イベントの間引き処理 */
    clearTimeout(timer);
    timer = setTimeout(function() {
      browserSync.reload();
    }, 200);
  });
});


// 一旦jsのコンパイルは無効にしている
// 有効にするには、wachタスクのコメントを有効化し、defaultタスクに'js'を追加する
gulp.task('default', ['server', 'watch', 'sass']);


/* remove */
gulp.task('del_css', function() {
  return gulp.src([CSS.DST_DIR + '*.css'], { read: false })
    .pipe($.rimraf({ force: true }));
});
gulp.task('del_js', function() {
  return gulp.src([JS.DST_DIR + 'app.js'], { read: false })
    .pipe($.rimraf({ force: true }));
});
