# はじめに
- これはkss-nodeをベースとしたスタイルガイドと、**cssの構成**をまとめたものです
- プロジェクトに用意されている汎用スタイルを一覧化しています
- 基本的に`_module`以外のscssについては汎用性はないため、スタイルガイドからは省略します（詳細は以下）
- 名前に`base`とついたものは、汎用性を持たせたものが多いため（Modifierでの調整を前提としたもの）、これらをベースに専用のモジュールを作成していくことも可能です




# scssの構成
- 基本構成は以下の通りです
- 必要に応じて修正・調整します

```
scss/
├ vendor/_*: 外部のscss, css, fwなどを格納
│
├ preset/       : 初期設定
│ ├ _variables : 共通で使用するグローバル変数・関数(mixin)を格納
│ └ _selector  : 要素セレクタのスタイル
│
├ project/    : プロジェクト固有のスタイル
│ ├ _layout  : ユニークに使用するもの。モジュールの接頭辞に `l-` をつける
│ ├ _module/ : 汎用的に使用するもの。モジュールの接頭辞に `m-` をつける
│ ├ _pages   : 特定のページでのみ使用するもの。接頭辞はつけない
│ └ _utility : 汎用的に使えるもの。接頭辞に `u-` をつける
│
├ style.scss : 全ページで使用するcssを生成。各partialをimportする
└ *.scss     : 特定のページでのみ使用するcssを生成
```


# 各ファイルの説明

## _layout
- ヘッダー・フッター・グローバルナビ、など機能と構成要素が固有のスタイルをまとめる
- classの接頭辞に l- を付けることで衝突を防ぎつつID的な意味合いを持つことを示す
- 具体的にそのclassが何を表しているかが分かる**セマンティックな名前**が望ましい
- `ex) .l-topic-path, .l-header, .l-g-navi, .l-main-column`

## _module
- プロジェクト内で汎用的に使いまわせるスタイルをまとめる
- classの接頭辞には m- を付けることで衝突を防ぎつつ、プロジェクト内独自のモジュールであることを示す
- 使い回す事を前提としているため、名前は**やや抽象的**にする

## _pages or *.scss
- 特定ページでのみ使用するスタイルをまとめる
- classには接頭辞を付けず、汎用性は無いものであることを示す
- 具体的にそのclassが何を表しているかが分かる**セマンティックな名前**が望ましい
- 状況に応じて`_pages`でまとめるか、`*.scss`として分けるか要検討

## _utility
- 特定の用途にのみ使用するアドホックなスタイルをまとめる
- classの接頭辞に**u-**を付けることで衝突を防ぎつつ、例外的なスタイルであることを示す
- 最小限の粒度を持ちなるべく**機能を端的に表す名前**にする
- 乱用に注意





# 基本ルール
## IDによるスタイル設定の禁止
* IDはjavaScriptによるフック、ページ内リンクなど、装飾以外の目的でのみ使用する

## 命名規則（BEMに基づく）
* BlockとElementはアンダースコア2つ *__* でつなぐ
* Modifierは **is-**、**has-** などを接頭辞としたマルチクラス方式を採用
* 単語間の区切りは __ハイフン__ でつなぐ
* ``` ex) .search-box > .search-box.is-vertical, .search-box__elem```

## ElementのElement（孫）の扱い
* 階層化が明確ではなくなるが、可読性を優先し命名上はエレメントを並列にする
* ex) itemをBlock, boxとheadをElementとした場合

```css
/* ダメ */
.item {}
.item__box {}
.item__box__head {}
/* OK */
.item {}
.item__box {}
.item__head {}
```

## scssファイルへの記述について
### Elementは並列に記述する
* 要素セレクタや擬似要素以外では、必要以上の階層化は避ける
* ただし親要素のModifierの変化の場合はこの限りでない（重複する可能性があるため）

```scss
// ダメ
.block {
  .block__element {
  }
}

// OK
.block {
  &.is-modifier {  // Block自身のModifier
  }
}
.block__element {
  &.is-modifier {  //Element自身のModifier
  }
  .block.is-modifier & { //BlockのModifierによるElementの変化
  }
}
```

### Modifierには直接設定しない
* マルチクラスを採用しているため重複する恐れがある

```scss 
// ダメ
div.is-modifier {
  display: none;
}
```





# layoutやmoduleで使用できそうな単語

> http://geckotang.tumblr.com/post/69554882865/bem-words を参考

## 組み合わせる

|名前   |説明|
|:--    |:--|
|**hero**   | -- より目立たせたいものに|
|**main**   | -- 主となるもの|
|**sub**    | -- 主となるものに付随するもの|
|**huge**   | -- 特大|
|**large**  | -- 大|
|**small**  | -- 小|
|**prev**   | -- 前|
|**next**   | -- 次|
|**local**  | -- 一部ページ|
|**global** | -- 全ページ|


## 何かを囲む

|名前   |説明|
|:--    |:--|
|**outer**   | -- wrapper, container相当|
|**inner**   | -- 内側の要素を囲む|
|**media**   | -- 画像やテキストを内包する|
|**block**   | -- 複数のコンテンツを内包する|
|**grid**    | -- グリッド|

## 機能を表す

|名前   |説明|
|:--    |:--|
|**tab**     | -- タブ|
|**nav**     | -- ナビゲーション|
|**heading** | -- 見出し|
|**list**    | -- 一覧|
|**item**    | -- 子要素用の名前|
|**slider**  | -- スライド|
|**tooltip** | -- ツールチップ|
|**banner**  | -- 自社バナー|
|**ad**      | -- 公告|

## 文章

|名前   |説明|
|:--    |:--|
|**article**  | -- 記事、本文|
|**caption**  | -- 画像や表の補足文|
|**desc**     | -- 説明文|
|**summary**  | -- 概要|
|**note**     | -- 補足文|
|**text**     | -- 文章|

## 画像

|名前   |説明|
|:--    |:--|
|**logo**  | -- ロゴ|
|**thumb** | -- サムネイル|
|**image** | -- 画像|
|**icon**  | -- アイコン|


## Modifier

|名前   |説明|
|:--    |:--|
|**is-active**   | -- 現在地|
|**is-disabled** | -- 機能が無効|
|**is-visible**  | -- 表示|
|**is-hidden**   | -- 非表示|
|**is-opened**   | -- 開いている|
|**is-closed**   | -- 閉じている|






# スタイルガイドの記述フォーマット
- scssファイルにコメントアウトをすることでスタイルが生成されます
- `/*  */` でのコメントアウトはcssファイルに出力されるため、`//` で記述します
- テーマURLに記述した値を持つhtmlが生成されます
- 一行間に空いていないと上手く生成されないことに注意ください
- その他細かい記述方法は`scss`を参考ください


```scss
// テーマ名
//
// テーマの簡単な説明
//
// :hover - Highlight the button when hovering.
//
// Markup:
// <a href="#" class="button {$modifiers}">Link</a>
// <button class="button {$modifiers}">Button</button>
//
// Styleguide: テーマURL
```





# その他メモ
- prefixは`gulp-autoprefix`を使用

