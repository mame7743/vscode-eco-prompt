import { useState, useMemo } from 'react';
import { TEMPLATES } from '../templates';
import TemplateSelector from './components/TemplateSelector';
import FieldForm from './components/FieldForm';
import Preview from './components/Preview';

// VS Code Webview API（グローバルに注入される）
declare const acquireVsCodeApi: () => { postMessage: (msg: unknown) => void };
const vscode = acquireVsCodeApi();

export default function App() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const activeTemplate = TEMPLATES.find((t) => t.id === activeId) ?? null;

  const preview = useMemo(() => {
    if (!activeTemplate) return '';
    return activeTemplate.build(fieldValues);
  }, [activeTemplate, fieldValues]);

  function handleSelectTemplate(id: string) {
    setActiveId(id);
    setFieldValues({});
  }

  function handleFieldChange(fieldId: string, value: string) {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleCopy() {
    vscode.postMessage({ type: 'copy', text: preview });
  }

  return (
    <div className="container">
      <h1>EcoPrompt 🌱</h1>
      <p className="subtitle">Build an optimized prompt, then copy to Copilot Chat.</p>

      <div className="section-label">1 · Choose a template</div>
      <TemplateSelector
        templates={TEMPLATES}
        activeId={activeId}
        onSelect={handleSelectTemplate}
      />

      {activeTemplate && (
        <FieldForm
          template={activeTemplate}
          values={fieldValues}
          onChange={handleFieldChange}
        />
      )}

      <div className="section-label">2 · Preview</div>
      <Preview text={preview} />

      <button
        className="copy-btn"
        disabled={!preview.trim()}
        onClick={handleCopy}
      >
        Copy to Clipboard
      </button>
    </div>
  );
}
