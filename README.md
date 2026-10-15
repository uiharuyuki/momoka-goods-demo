# MOMOKA GOODS — graduation demo

小鳥遊ももかの外部Goodsサイトを想定した、**非販売の卒業制作ワイヤーフレーム**。
商品・価格・仕様・完成画像は未確定です。注文・決済・会員登録・個人情報入力はありません。

## Site roles

- このリポジトリ：外部Goodsのデモ。`https://uiharuyuki.github.io/momoka-goods-demo/`
- キャラクター本体：`https://momoka-cloudflare-poc.nirayuki15.workers.dev/`
- `momoka_ai`：独立したビジュアル確認用ワイヤー。ここから配備・同期しません。

## Screens and interactions

- Top：A案の配置を使ったシンプルなワイヤー。左に見出しと商品枠、右に大きな人物枠。その下にショートカット、Pickup、コレクション紹介、8件の企画アイテム。
- `#/items`：カテゴリ・キーワード検索・名前順ソート、0件時のリセット。
- `#/item/acrylic-stand` など：商品詳細、仮画像・デザインの切替、拡大ダイアログ、仕様の開閉、関連商品。
- `#/guide`：非販売デモの説明とデータの扱い。
- 存在しない商品URL：一覧へ戻る案内。

ブラウザの戻る操作でページ内の検索条件を維持します。再読み込みで検索・選択状態はリセットされます。実音源、カート、決済、外部API、アカウント、アクセス解析は追加していません。

見た目の精度は `momoka_ai` のワイヤーとそろえます。白地・グレーの画像枠・細い枠線を使い、人物・商品は `CHARACTER PLACEHOLDER` / `PRODUCT IMAGE` として表示します。イラスト、商品線画、傾き、縁取り題字、影、装飾背景は再現しません。A案は配置と導線の参考であり、完成デザインの実装ではありません。

## Local use

Node.js 22.12以上を使用します。

```sh
npm ci
npm run dev
```

開発URLはViteの表示を確認してください。base pathは `/momoka-goods-demo/` です。

## Verification

```sh
npm run check
npx playwright install chromium
npm run test:ui
npm audit --audit-level=high
```

- `check`：JavaScript構文、商品データ・検索・URL処理の単体テスト、production build。
- `test:ui`：ローカルpreviewを自動起動し、検索・カテゴリ・詳細8件・モーダル・320/390/768/1440px・非販売境界をブラウザで検証。終了時にpreviewを停止。
- ブラウザ実行ファイルを指定する場合は `CHROMIUM_EXECUTABLE`、画像・結果の保存先は `UI_ARTIFACT_DIR` を設定できます。
- 公開済みPagesの読み戻しには `UI_BASE_URL=https://uiharuyuki.github.io/momoka-goods-demo/` を指定して `node tests/browser.mjs` を実行できます。
- GitHub Actionsはcheckとブラウザ検証の後にだけPagesへ配備します。

## Source map

- `src/catalog.js`：仮商品データ、絞り込み、ルート解析、HTMLエスケープ。
- `src/art.js`：商品画像の仮枠。画像／デザイン選択に応じてラベルを更新します。
- `src/main.js`：画面描画と操作。hash routeで直接URLとGitHub Pagesを両立。
- `src/styles.css`：PC／スマートフォンのワイヤー形状。
- `src/popup.js` / `src/popup.css`：A案の配置だけを残したHTML/CSS構成とショートカット。画像カンプの貼り付けではありません。
- `src/assets/momoka-pose-wire.svg`：過去の試作素材。現在は未使用で、公開ビルドには含めません。
- `public/robots.txt`、`index.html`：検索除外の意図を表明。アクセス制限ではありません。

## Reference boundary

紡ネンのPictoria公式BOOTH、Kizuna AI公式Goods Store、hololive公式ショップの一覧・詳細を比較し、画像比率・階層・検索・サムネイル切替の構造だけを参考にしました。第三者のスクリーンショット・ロゴ・商品画像・ソースコードはこのリポジトリに含みません。

公式リンク：
- https://pictoria.booth.pm/item_lists/m4ZTvOW8
- https://official-goods-store.jp/kizunaai/
- https://shop.hololivepro.com/collections/regularoutfit

検索語・選択はページ内メモリだけで扱います。配信基盤のGitHub Pagesによるセキュリティログと、アプリ自身の保存・送信は別です。

## Before real sales

このデモを実販売に転用する場合、ホスティング規約、素材の権利、商品仕様、販売事業者の義務、決済・個人情報管理を別工程で検討してください。現在のPagesデモを、そのまま販売サイトに切り替える前提にはしていません。
