# このリポジトリの目的

個人的にサイト制作時の初期テンプレートとして必要になりそうなものをまとめたスターターキット。  
主に静的なサイト制作を想定しているが、動的サイトへの組み込みにも使えるはず。





# リポジトリが提供する機能

##gulpによる様々なタスク処理

- sassのコンパイル
- スタイルガイドのコンパイル
- csscombの実行
- autoprefixerの実行
- browserifyによるjs依存の解決・結合・圧縮など（任意）
- 静的サーバの立ち上げとライブリロード（ssiによるインクルード動作）


##htmlの初期テンプレート

- Boilerplateベース
- jsの判別のみを持ったmodernizr.js
- font-awesome

##cssの基本設計

- sassファイルの設計
- 使用する外部ライブラリ・フレームワーク

## スタイルガイド

- 汎用モジュールの例と使い方、cssの運用ルールを記載した**静的html群**
- 使い方については、スタイルガイド内のトップに記載
- コンパイルはgulpにより、/root/以下に/_guide/というディレクトリに出力される
- 一度作成されたhtmlはそのままなので、不要なものは一旦すべて削除してから再出力すると最適なものに





# 使い方

- リポジトリをダウンロード
- 必要なプロジェクト内へファイルを格納し、以下を実行
- cloneで取ってきた場合は、改めてプロジェクトのリポジトリを作成する（これはあくまで初期テンプレなため）

> jsの処理を使用しない場合は、_no-js-config/内のpackage.jsonに差し替える


```
$ npm install
```

> インストールにつまづいたら適宜対応

##基本タスクの実行

静的サーバーの構築・sassのコンパイル・watchなど。  
※デフォルトではjsの処理は行っていない

```
$ gulp
```

##スタイルガイドのコンパイル

```
$ gulp guide
```





# 役に立つサイト

- [csscombをオンライン上で生成する](http://csscomb.com/config)
- [modernizrのカスタマイズ](https://modernizr.com/)
- [ネーミングツール](https://codic.jp/)
- [cssの優先度を確認する](http://specificity.keegan.st/)




# ひとまず取り上げないもの

- htmlプリプロセッサ
- bower
- altjs

