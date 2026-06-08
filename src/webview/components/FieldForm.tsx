import { Template } from '../../templates';

interface Props {
  template: Template;
  values: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
}

export default function FieldForm({ template, values, onChange }: Props) {
  return (
    <div className="tmpl-fields">
      {template.fields.map((field) => (
        <div key={field.id}>
          <label>{field.label}</label>
          {field.multiline ? (
            <textarea
              placeholder={field.placeholder}
              value={values[field.id] ?? ''}
              onChange={(e) => onChange(field.id, e.target.value)}
              rows={5}
            />
          ) : (
            <input
              type="text"
              placeholder={field.placeholder}
              value={values[field.id] ?? ''}
              onChange={(e) => onChange(field.id, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
