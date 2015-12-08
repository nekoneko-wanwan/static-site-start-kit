// 全ページ共通で使用するスクリプト

/**
 * グローバルナビゲーションの現在地表示
 * - グローバルナビゲーションの該当する項目にclassを付与
 * - 該当する項目とは、どの第1ディレクトリに属しているページがどうか
 */
var setClassGnav = function() {
  // 第1ディレクトリを取得（#以下を排除しておく）
  var dir = location.href.split('/')[3].replace(/^(.*)#(.*)/,'$1');

  // ホームかどうか
  var isTopPage = function() {
    var topFileNames = ['', 'index.html', 'index.htm', 'index.php', 'index'];
    if (topFileNames.indexOf(dir) >= 0) {
      return true;
    } else {
      return false;
    }
  };

  // 該当する項目にclassを付与
  var $nav = $('#js-gnav');
  if (isTopPage()) {
    $nav.find('a[href="/"]').addClass('is-active');
  } else {
    $nav.find('a[href="/'+dir+'/"]').addClass('is-active');
  }
};



/**
 * サブナビゲーションの現在地表示
 * - サブナビゲーションの該当する項目にclassを付与
 */
var setClassSnav = function() {
  var $nav = $('#js-snav');

  // サブナビが存在しなければ離脱
  if ($nav.size() <= 0 ) { return;}

  var getPathName = function() {
    var path = location.pathname;
    var arr  = path.split('/');
    var lastPathName = arr.slice(arr.length - 1)[0];

    // indexかどうか
    var isIndexPage = function() {
      var indexFileNames = ['index.html', 'index.htm', 'index.php', 'index'];
      if (indexFileNames.indexOf(lastPathName) >= 0) {
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
  };

  // 該当する項目にclassを付与
  $nav.find('a[href="' + getPathName() + '"]').addClass('is-active');
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
  setClassGnav();
  setClassSnav();
  smoothScroll();
});

