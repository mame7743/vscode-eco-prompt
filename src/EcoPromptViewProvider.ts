import * as vscode from 'vscode';
import { TEMPLATES } from './templates';

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

    webviewView.webview.onDidReceiveMessage(async (msg) => {
      if (msg.type === 'copy') {
        await vscode.env.clipboard.writeText(msg.text);
        vscode.window.showInformationMessage('EcoPrompt: Copied to clipboard!');
      }
    });
  }

  private _getHtml(): string {
    const templateButtons = TEMPLATES.map(
      (t) => `<button class="tmpl-btn" data-id="${t.id}" title="${t.description}">${t.label}</button>`
    ).join('\n        ');

    const templateFieldSections = TEMPLATES.map((t) => {
      const fields = t.fields
        .map((f) =>
          f.multiline
            ? `<label>${f.label}</label><textarea id="${t.id}__${f.id}" placeholder="${f.placeholder}" rows="5"></textarea>`
            : `<label>${f.label}</label><input type="text" id="${t.id}__${f.id}" placeholder="${f.placeholder}">`
        )
        .join('\n      ');
      return `<div class="tmpl-fields" id="fields__${t.id}" style="display:none">\n      ${fields}\n    </div>`;
    }).join('\n    ');

    const templateDefs = JSON.stringify(
      TEMPLATES.map((t) => ({
        id: t.id,
        fields: t.fields.map((f) => f.id),
        // build logic is re-implemented client-side below
      }))
    );

    const buildLogic = TEMPLATES.map((t) => {
      // Serialize the build function body as a string to run in the webview
      const fnSrc = t.build.toString();
      return `buildFns['${t.id}'] = ${fnSrc};`;
    }).join('\n      ');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EcoPrompt 🌱</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background: var(--vscode-sideBar-background);
      margin: 0;
      padding: 10px;
    }
    h1 {
      font-size: 1em;
      font-weight: 700;
      margin: 0 0 4px;
    }
    .subtitle {
      font-size: 0.8em;
      color: var(--vscode-descriptionForeground);
      margin: 0 0 12px;
    }
    /* Template selector */
    .tmpl-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 14px;
    }
    .tmpl-btn {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      border: 1px solid var(--vscode-button-border, transparent);
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 0.82em;
      cursor: pointer;
      white-space: nowrap;
    }
    .tmpl-btn:hover {
      background: var(--vscode-button-secondaryHoverBackground);
    }
    .tmpl-btn.active {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
    }
    /* Fields */
    .tmpl-fields label {
      display: block;
      font-size: 0.8em;
      color: var(--vscode-descriptionForeground);
      margin: 8px 0 3px;
    }
    .tmpl-fields input,
    .tmpl-fields textarea {
      width: 100%;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border, #555);
      border-radius: 3px;
      padding: 5px 7px;
      font-family: inherit;
      font-size: 0.9em;
      resize: vertical;
    }
    .tmpl-fields textarea { min-height: 80px; }
    /* Preview */
    .section-label {
      font-size: 0.8em;
      font-weight: 600;
      color: var(--vscode-descriptionForeground);
      margin: 14px 0 4px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    #preview {
      width: 100%;
      min-height: 100px;
      background: var(--vscode-textCodeBlock-background, #1e1e1e);
      color: var(--vscode-editor-foreground);
      border: 1px solid var(--vscode-input-border, #555);
      border-radius: 3px;
      padding: 7px;
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: 0.85em;
      resize: vertical;
      white-space: pre-wrap;
      word-break: break-word;
    }
    /* Copy button */
    #copyBtn {
      margin-top: 10px;
      width: 100%;
      padding: 7px;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 4px;
      font-size: 0.9em;
      font-weight: 600;
      cursor: pointer;
    }
    #copyBtn:hover { filter: brightness(1.1); }
    #copyBtn:disabled { opacity: 0.45; cursor: default; }
    .empty-hint {
      color: var(--vscode-descriptionForeground);
      font-size: 0.82em;
      font-style: italic;
    }
  </style>
</head>
<body>
  <h1>EcoPrompt 🌱</h1>
  <p class="subtitle">Build an optimized prompt, then copy to Copilot Chat.</p>

  <!-- Step 1: Template selection -->
  <div class="section-label">1 · Choose a template</div>
  <div class="tmpl-grid">
    ${templateButtons}
  </div>

  <!-- Step 2: Fill in fields -->
  <div id="fieldsContainer">
    ${templateFieldSections}
  </div>

  <!-- Step 3: Preview -->
  <div class="section-label">2 · Preview</div>
  <div id="preview" class="empty-hint">(select a template above)</div>

  <!-- Action -->
  <button id="copyBtn" disabled>Copy to Clipboard</button>

  <script>
    const vscode = acquireVsCodeApi();
    const templateDefs = ${templateDefs};

    // Build functions keyed by template id
    const buildFns = {};
    ${buildLogic}

    let activeId = null;

    const buttons = document.querySelectorAll('.tmpl-btn');
    const preview = document.getElementById('preview');
    const copyBtn = document.getElementById('copyBtn');

    function getFieldValues(tmplId) {
      const def = templateDefs.find(t => t.id === tmplId);
      if (!def) return {};
      const vals = {};
      for (const fid of def.fields) {
        const el = document.getElementById(tmplId + '__' + fid);
        vals[fid] = el ? el.value : '';
      }
      return vals;
    }

    function updatePreview() {
      if (!activeId || !buildFns[activeId]) {
        preview.textContent = '';
        preview.classList.add('empty-hint');
        copyBtn.disabled = true;
        return;
      }
      const text = buildFns[activeId](getFieldValues(activeId));
      preview.classList.remove('empty-hint');
      preview.textContent = text || '';
      copyBtn.disabled = !text.trim();
    }

    function selectTemplate(id) {
      activeId = id;
      buttons.forEach(b => b.classList.toggle('active', b.dataset.id === id));
      document.querySelectorAll('.tmpl-fields').forEach(el => {
        el.style.display = el.id === 'fields__' + id ? '' : 'none';
      });
      updatePreview();
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', () => selectTemplate(btn.dataset.id));
    });

    document.addEventListener('input', (e) => {
      if (e.target.closest('.tmpl-fields')) updatePreview();
    });

    copyBtn.addEventListener('click', () => {
      vscode.postMessage({ type: 'copy', text: preview.textContent });
    });
  </script>
</body>
</html>`;
  }
}
