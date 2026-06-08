import * as vscode from 'vscode';
import { EcoPromptViewProvider } from './EcoPromptViewProvider';

export function activate(context: vscode.ExtensionContext) {
  const provider = new EcoPromptViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      EcoPromptViewProvider.viewType,
      provider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('ecoPrompt.openPanel', () => {
      vscode.commands.executeCommand('workbench.view.extension.eco-prompt');
    })
  );
}

export function deactivate() {}
