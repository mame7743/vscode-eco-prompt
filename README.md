# EcoPrompt 🌱

GitHub Copilot の費用とトークンを節約する AI プロンプト最適化アシスタント。  
UI 操作だけで JSON/ログの自動圧縮や無駄な出力を防ぐテクニックを簡単に実践。生のプロンプトと最適化後をリアルタイムに対比可能。

> **Status: WIP** — MVP 開発中です。

---

## 機能（予定）

| 機能 | 説明 |
|---|---|
| テンプレート選択 | Code Review / Bug Fix / Explain / Generate など用途別テンプレート |
| Headroom | 入力中の JSON/ログを自動ミニファイ（トークン削減） |
| Caveman Prompt | 冗長な出力を抑制するルール文を末尾に自動注入 |
| リアルタイムプレビュー | 最適化前後のプロンプトを対比表示、削減率を表示 |
| Copy & Open Copilot | 最適化済みプロンプトをワンクリックでコピー＆Copilot Chat を起動 |

---

## 開発環境のセットアップ

### 前提条件

- [Node.js](https://nodejs.org/) v20 以上
- [VS Code](https://code.visualstudio.com/) v1.85 以上

### インストール

```bash
git clone https://github.com/mame7743/vscode-eco-prompt.git
cd vscode-eco-prompt
npm install
```

---

## デバッグ方法

### F5 で Extension Development Host を起動する（推奨）

1. VS Code でこのリポジトリを開く
2. **`F5`** を押す（または `Run > Start Debugging`）
3. 自動的に TypeScript がコンパイルされ、**Extension Development Host** ウィンドウが新しく開く
4. その新しいウィンドウのアクティビティバーに **🌱 アイコン** が表示される
5. アイコンをクリックすると EcoPrompt サイドバーが開く

> **初回のみ**: `npm install` を済ませてから F5 してください。

### ホットリロード（ファイル変更を即反映）

拡張機能本体（Node.js 側）と Webview（React 側）でそれぞれ watch を起動します。
**ターミナルを2つ**開いて実行してください。

```bash
# ターミナル1: 拡張機能本体（src/extension.ts など）
npm run watch

# ターミナル2: Webview の React コード（src/webview/ 以下）
npm run watch:webview
```

その後 F5 で Extension Development Host を起動し、変更を保存したら **`Ctrl+R`（Mac: `Cmd+R`）** でリロードすると反映されます。

launch.json には watch モード用の構成も用意しています。

| 構成名 | 説明 |
|---|---|
| **Run Extension** | F5 で起動。毎回 `npm run compile` と `npm run build:webview` を実行 |
| **Run Extension (watch)** | watch を先に起動した状態で使う。コンパイル待ちなし |

### ブレークポイントの使い方

- `src/extension.ts` や `src/EcoPromptViewProvider.ts` の行番号の左をクリックしてブレークポイントを設置
- F5 で起動すると、そのコードが実行された時点で VS Code がポーズする

### Webview（サイドバー UI）のデバッグ

Webview 内の HTML/JS はブラウザの DevTools と同じ方法でデバッグできます。

1. Extension Development Host ウィンドウで `Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）
2. `Developer: Open Webview Developer Tools` を実行
3. Console / Elements / Sources タブで通常の Web 開発と同様にデバッグ

### ログ出力

拡張機能本体（Node.js 側）のログは、デバッグ元の VS Code ウィンドウの **Debug Console** に表示されます。

```typescript
// 例
console.log('EcoPrompt:', someValue);
```

---

## プロジェクト構成

```
vscode-eco-prompt/
├── src/
│   ├── extension.ts              # エントリポイント。プロバイダ登録
│   ├── EcoPromptViewProvider.ts  # サイドバー Webview プロバイダ（React バンドルを読み込む）
│   ├── templates.ts              # プロンプトテンプレート定義
│   └── webview/                  # React アプリ（Vite でビルド → out/webview/ へ出力）
│       ├── main.tsx              # React エントリポイント
│       ├── App.tsx               # ルートコンポーネント・状態管理
│       ├── styles.css            # VS Code テーマ変数を使ったスタイル
│       └── components/
│           ├── TemplateSelector.tsx
│           ├── FieldForm.tsx
│           └── Preview.tsx
├── resources/
│   └── icon.svg                  # アクティビティバーアイコン
├── .vscode/
│   ├── launch.json               # F5 デバッグ設定
│   └── tasks.json                # ビルドタスク設定
├── vite.config.ts                # Webview 用 Vite 設定
├── tsconfig.json                 # 拡張機能本体用（webview/ を除外）
├── tsconfig.webview.json         # Webview 用（Vite が参照）
└── package.json                  # 拡張機能マニフェスト
```

### ビルドの仕組み

```
src/webview/ ──[Vite]──▶ out/webview/main.js, main.css
src/*.ts     ──[tsc]───▶ out/*.js
                              │
                    EcoPromptViewProvider が
                    out/webview/main.js を HTML に埋め込む
```

---

## 開発フロー（PR 駆動）

| Phase | 内容 | ステータス |
|---|---|---|
| Phase 1 | プロジェクト雛形・サイドバー登録 | ✅ Done |
| Phase 2 | テンプレート選択 UI・プレビュー・クリップボードコピー | ✅ Done |
| Phase 3 | Headroom（JSON ミニファイ）・Caveman・トークン削減率表示 | 🔜 Next |
| Phase 4 | Copy & Open Copilot Chat ボタン | 🔜 Next |
