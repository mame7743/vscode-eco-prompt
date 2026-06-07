import * as vscode from 'vscode';

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

    webviewView.webview.html = this._getHtml();
  }

  private _getHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EcoPrompt 🌱</title>
  <style>
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background: var(--vscode-sideBar-background);
      margin: 0;
      padding: 12px;
      box-sizing: border-box;
    }
    h2 {
      margin: 0 0 12px 0;
      font-size: 1em;
      font-weight: 600;
    }
    p.subtitle {
      color: var(--vscode-descriptionForeground);
      font-size: 0.85em;
      margin: 0 0 16px 0;
    }
  </style>
</head>
<body>
  <h2>EcoPrompt 🌱</h2>
  <p class="subtitle">Prompt optimizer for GitHub Copilot — coming soon.</p>
</body>
</html>`;
  }
}
