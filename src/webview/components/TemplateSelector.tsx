import { Template } from '../../templates';

interface Props {
  templates: Template[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function TemplateSelector({ templates, activeId, onSelect }: Props) {
  return (
    <div className="tmpl-grid">
      {templates.map((t) => (
        <button
          key={t.id}
          className={`tmpl-btn ${t.id === activeId ? 'active' : ''}`}
          title={t.description}
          onClick={() => onSelect(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
