import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class EcoPromptViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'ecoPrompt.mainView';

  constructor(private readonly _extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtml(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      if (msg.type === 'copy') {
        await vscode.env.clipboard.writeText(msg.text);
        vscode.window.showInformationMessage('EcoPrompt: Copied to clipboard!');
      }
    });
  }

  private _getHtml(webview: vscode.Webview): string {
    const webviewOutDir = path.join(this._extensionUri.fsPath, 'out', 'webview');
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.file(path.join(webviewOutDir, 'main.js'))
    );

    // CSS が存在する場合のみ読み込む
    const cssPath = path.join(webviewOutDir, 'main.css');
    const cssTag = fs.existsSync(cssPath)
      ? `<link rel="stylesheet" href="${webview.asWebviewUri(vscode.Uri.file(cssPath))}">`
      : '';

    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none';
             style-src ${webview.cspSource} 'unsafe-inline';
             script-src 'nonce-${nonce}';">
  <title>EcoPrompt 🌱</title>
  ${cssTag}
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}

function getNonce() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
