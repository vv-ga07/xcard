# Xリンクカード生成ツール

X（旧Twitter）で共有する際に、魅力的なリンクカードを表示するためのHTMLファイルを生成するツールです。

## 🌟 機能

- ✅ GUI上でタイトル、説明文、画像、URLを設定
- ✅ リアルタイムプレビュー機能
- ✅ OGPタグ（Open Graph Protocol）対応
- ✅ Twitter Card対応
- ✅ **自動URL生成 - GitHub Pages URLを自動で生成**
- ✅ **Gitコマンド自動生成 - デプロイコマンドをワンクリックでコピー**
- ✅ **設定保存機能 - GitHubユーザー名とリポジトリ名を記憶**
- ✅ GitHub Pagesで簡単にホスティング可能
- ✅ 画像をBase64でHTML内に埋め込み（追加ファイル不要）

## 📦 セットアップ

### 1. リポジトリのクローンまたはダウンロード

```bash
git clone https://github.com/your-username/xcarad.git
cd xcarad
```

### 2. GitHub Pagesの有効化

1. GitHubリポジトリの「Settings」→「Pages」に移動
2. Source を「main branch」に設定
3. 保存すると、URL（例：`https://your-username.github.io/xcarad/`）が表示されます

### 3. ツールにアクセス

ブラウザで `https://your-username.github.io/xcarad/` を開きます。

## 🚀 使い方

### 初回セットアップ

1. **GitHubリポジトリを作成**
   ```bash
   # ローカルでリポジトリを初期化
   cd c:\tool\xcarad
   git init
   git add .
   git commit -m "Initial commit"
   
   # GitHubにプッシュ
   git remote add origin https://github.com/your-username/xcarad.git
   git branch -M main
   git push -u origin main
   ```

2. **GitHub Pagesを有効化**
   - GitHubリポジトリの「Settings」→「Pages」に移動
   - Source を「main branch」に設定
   - 保存すると、URL（例：`https://your-username.github.io/xcarad/`）が表示されます

3. **ツールでGitHub設定を保存**
   - ツールを開く（`https://your-username.github.io/xcarad/`）
   - 「⚙️ GitHub設定」ボタンをクリック
   - GitHubユーザー名とリポジトリ名を入力
   - 「設定を保存」をクリック（LocalStorageに保存されます）

### リンクカードの作成手順（自動デプロイ版）

1. **情報を入力**
   - **タイトル**：リンクカードに表示されるタイトル（必須）
   - **説明文**：カードの説明文（任意）
   - **広告URL**：ユーザーを誘導したいURL（必須）
   - **画像**：カードに表示される画像（必須、1200x630px推奨）
   - **ファイル名**：生成されるHTMLファイルの名前（デフォルト：card）

2. **プレビュー確認**（任意）
   - 「プレビュー」ボタンをクリックして、カードの見た目を確認

3. **リンクカード生成**
   - 「リンクカードを生成」ボタンをクリック
   - **XのURLが自動生成されます！** 🎉

4. **自動デプロイ（3つの方法）**

   **方法1: Gitコマンドを使用（推奨）**
   ```bash
   # 1. HTMLをダウンロード
   # 2. リポジトリフォルダに移動
   # 3. 「🚀 デプロイコマンドをコピー」をクリック
   # 4. ターミナルに貼り付けて実行
   ```

   **方法2: デプロイスクリプトを使用（Windows）**
   ```powershell
   # HTMLファイルをダウンロード後
   .\deploy.ps1 card
   ```

   **方法3: デプロイスクリプトを使用（Mac/Linux）**
   ```bash
   # HTMLファイルをダウンロード後
   chmod +x deploy.sh
   ./deploy.sh card
   ```

5. **Xで共有**
   - 「📋 コピー」ボタンをクリックしてURLをコピー
   - Xのポストに貼り付け
   - 自動的にリンクカードが表示されます！ 🎊

### クイックデプロイ例

```powershell
# Windows PowerShell
cd c:\tool\xcarad
.\deploy.ps1 my-awesome-card
```

```bash
# Mac/Linux
cd /path/to/xcarad
./deploy.sh my-awesome-card
```

## 📝 注意事項

### 画像のサイズと形式

- **推奨サイズ**：1200x630px（Twitter Card Large Image）
- **対応形式**：JPG, PNG, GIF
- **ファイルサイズ**：5MB以下推奨（Base64エンコードされるため）
    # メインの生成ツール画面
├── style.css           # スタイルシート
├── script.js           # リンクカード生成ロジック
├── deploy.ps1          # 自動デプロイスクリプト（Windows）
├── deploy.sh           # 自動デプロイスクリプト（Mac/Linux）
├── example-card.html   # サンプルリンクカード
└── README.md    B以下
- ファイルサイズ：100MB以下
- 月間帯域幅：100GB以下
- 1時間あたりのビルド回数：10回以下

### カスタムドメイン（オプション）

GitHub Pagesでカスタムドメインを使用する場合：

1. リポジトリの「Settings」→「Pages」で「Custom domain」を設定
2. DNSプロバイダーで CNAME レコードを設定
3. 詳細は[GitHub公式ドキュメント](https://docs.github.com/ja/pages/configuring-a-custom-domain-for-your-github-pages-site)を参照

## 🛠️ 技術仕様

### OGPタグ

リンクカードには以下のOGPタグが含まれます：

```html
<meta property="og:title" content="タイトル" />
<meta property="og:description" content="説明文" />
<meta property="og:image" content="data:image/png;base64,..." />
<meta property="og:url" content="広告URL" />
<meta property="og:type" content="website" />
```

### Twitter Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="タイトル" />
<meta name="twitter:description" content="説明文" />
<meta name="twitter:image" content="data:image/png;base64,..." />
```

## 🔧 カスタマイズ

### スタイルの変更

[style.css](style.css) を編集して、ツールのデザインをカスタマイズできます。

### 生成されるHTMLのカスタマイズ

[script.js](script.js) の `generateCardHTML()` 関数を編集して、生成されるHTMLをカスタマイズできます。

## 📄 ファイル構成

```
xcarad/
├── index.html      # メインの生成ツール画面
├── style.css       # スタイルシート
├── script.js       # リンクカード生成ロジック
└── README.md       # このファイル
```

## 🐛 トラブルシューティング

### リンクカードが表示されない

1. **OGPタグの確認**
   - 生成されたHTMLファイルのOGPタグが正しいか確認
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator) で検証

2. **画像サイズの確認**
   - 画像が大きすぎるとリンクカードが表示されないことがあります
   - 画像を圧縮するか、サイズを小さくしてみてください

3. **キャッシュのクリア**
   - Xはリンクカードをキャッシュするため、更新が反映されるまで時間がかかることがあります
   - URLパラメータ（例：`?v=2`）を付けて新しいURLとして認識させる方法もあります

### GitHub Pagesが表示されない

1. リポジトリが公開されているか確認
2. GitHub Pagesが有効化されているか確認 Settings」→「Pages」）
3. デプロイが完了するまで数分待つ

## 📚 参考リンク

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [GitHub Pages Documentation](https://docs.github.com/ja/pages)

## 📜 ライセンス

MIT License

## 🤝 貢献

プルリクエストを歓迎します！バグ報告や機能リクエストは、Issueで報告してください。

---

Created with ❤️ for X users
