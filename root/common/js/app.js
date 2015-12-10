/**
 * 全ページ共通で使用するスクリプト
 */

/* 変数一覧 */
var index_list = ['', 'index.html', 'index.htm', 'index.php', 'index'];



/**
 * 汎用的な関数
 */
var utility = {
  /**
   * getPathName: location.pathnameをカスタムして取得
   * - カスタム1: 渡した文字列が含まれればそれを削除する（トップと見なす）
   * - カスタム2: # 以下を削除する
   *
   * @param {array} index_list
   * @return {str} 
   */
  getPathName: function(list) {
    list = list || index_list;
    var path = location.pathname;
    var arr  = path.split('/');
    var lastPathName = arr.slice(arr.length - 1)[0];

    // indexかどうか
    var isIndexPage = function() {
      if (list.indexOf(lastPathName) >= 0) {
        return true;
      } else {
        return false;
      }
    };

    // もしindexだったら、pathのlastPathNameを削除
    if (isIndexPage()) {
      path = path.replace(new RegExp(lastPathName, 'g'), '');
    }
    return path;
  }
};



/**
 * グローバルナビゲーションの現在地表示
 * - グローバルナビゲーションの該当する項目にclassを付与
 * - 該当する項目とは、どの第1ディレクトリに属しているページがどうか
 *
 * $param {jqueryObj} $elm: 対象とするナビのjqueryObjectを渡す
 */
var setClassGnav = function($elm) {
  // 第1ディレクトリを取得（#以下を排除しておく）
  var dir = location.href.split('/')[3].replace(/^(.*)#(.*)/,'$1');

  // ホームかどうか
  var isHomePage = function() {
    return index_list.indexOf(dir) >= 0 ? true : false;
  };

  // 該当する項目にclassを付与
  if (isHomePage()) {
    $elm.find('a[href="/"]').addClass('is-active');
  } else {
    $elm.find('a[href="/'+dir+'/"]').addClass('is-active');
  }
};



/**
 * サブナビゲーションの現在地表示
 * - サブナビゲーションの該当する項目にclassを付与
 *
 * $param {jqueryObj} $elm: 対象とするナビのjqueryObjectを渡す
 */
var setClassSnav = function($elm) {
  // サブナビが存在しなければ離脱
  if ($elm.size() <= 0 ) { return;}

  // 該当する項目にclassを付与
  var pathName = utility.getPathName();
  $elm.find('a[href="' + pathName + '"]').addClass('is-active');
};



/**
 * バナーの重複削除
 * - 現在表示しているページに該当するバナーを削除する
 *
 * $param {jqueryObj} $elm: 対象とするバナーのjqueryObjectを渡す
 */
var removeConflictBanner = function($elm) {
  // バナーが存在しなければ離脱
  if ($elm.size() <= 0 ) { return;}

  // 該当する項目にclassを付与
  var pathName = utility.getPathName();
  $elm.find('a[href="' + pathName + '"]').parent('li').remove();
};



/**
 * スムーズスクロール
 * - クリックでjQueryを使ったアニメーションスクロールを実行
 * - data-scroll-anim="false" をつけることで非適用にできる
 */
var smoothScroll = function() {
  // ブラウザ判定 (html, bodyのどちらでanimateさせるか判断)
  var isHtmlScrollable = function() {
    var html = $('html'), top = html.scrollTop();
    var elm = $('<div/>').height(10000).prependTo('body');
    html.scrollTop(10000);
    var rs = !!html.scrollTop();
    html.scrollTop(top);
    elm.remove();
    return rs;
  };

  // スクロール処理
  // @param {str} target: hrefの値
  // @param {str} speed: アニメーション速度
  var scrollAction = function(target, speed) {
    // ガード処理
    if ($(target).length === 0) { return;}

    speed = speed || 500;

    $(isHtmlScrollable() ? 'html' : 'body').stop(true,true).animate({
      scrollTop: $(target).offset().top
    }, speed);
  };

  // イベントハンドラ
  var addScrollEvt = function() {
    $('a[href^=#]:not(:animated)').on('click', function(){
      // ガード処理
      if($(this).data('scroll-anim') === false){ return true;}

      var t = $(this).attr('href');
      scrollAction(t);
      return false;
    });
  };

  return addScrollEvt();
};



$(function() {
  setClassGnav($('#js-gnav'));
  setClassSnav($('#js-snav'));
  removeConflictBanner($('#js-banner'));
  smoothScroll();
});


