export interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  multiline: boolean;
}

export interface Template {
  id: string;
  label: string;
  description: string;
  fields: TemplateField[];
  build: (values: Record<string, string>) => string;
}

export const TEMPLATES: Template[] = [
  {
    id: 'free',
    label: '✏️ Free Input',
    description: 'Paste any instruction or data as-is.',
    fields: [
      {
        id: 'text',
        label: 'Prompt',
        placeholder: 'Type or paste your prompt here…',
        multiline: true,
      },
    ],
    build: (v) => v['text'] ?? '',
  },
  {
    id: 'code_review',
    label: '🔍 Code Review',
    description: 'Ask Copilot to review a code snippet.',
    fields: [
      {
        id: 'lang',
        label: 'Language',
        placeholder: 'e.g. TypeScript',
        multiline: false,
      },
      {
        id: 'code',
        label: 'Code',
        placeholder: 'Paste code here…',
        multiline: true,
      },
      {
        id: 'focus',
        label: 'Focus (optional)',
        placeholder: 'e.g. security, performance',
        multiline: false,
      },
    ],
    build: (v) => {
      const focus = v['focus'] ? ` Focus on: ${v['focus']}.` : '';
      return `Review the following ${v['lang'] ?? ''} code.${focus}\n\n\`\`\`${v['lang'] ?? ''}\n${v['code'] ?? ''}\n\`\`\``;
    },
  },
  {
    id: 'bug_fix',
    label: '🐛 Bug Fix',
    description: 'Describe a bug and ask for a fix.',
    fields: [
      {
        id: 'lang',
        label: 'Language',
        placeholder: 'e.g. Python',
        multiline: false,
      },
      {
        id: 'code',
        label: 'Buggy Code',
        placeholder: 'Paste the problematic code…',
        multiline: true,
      },
      {
        id: 'symptom',
        label: 'Symptom / Error',
        placeholder: 'e.g. IndexError on line 12',
        multiline: false,
      },
    ],
    build: (v) =>
      `Fix the bug in the following ${v['lang'] ?? ''} code.\nSymptom: ${v['symptom'] ?? ''}\n\n\`\`\`${v['lang'] ?? ''}\n${v['code'] ?? ''}\n\`\`\``,
  },
  {
    id: 'explain',
    label: '📖 Explain Code',
    description: 'Get a concise explanation of a snippet.',
    fields: [
      {
        id: 'code',
        label: 'Code',
        placeholder: 'Paste code to explain…',
        multiline: true,
      },
    ],
    build: (v) =>
      `Explain what the following code does:\n\n\`\`\`\n${v['code'] ?? ''}\n\`\`\``,
  },
  {
    id: 'generate',
    label: '⚡ Generate Code',
    description: 'Generate code from a short spec.',
    fields: [
      {
        id: 'lang',
        label: 'Language',
        placeholder: 'e.g. Go',
        multiline: false,
      },
      {
        id: 'spec',
        label: 'What to build',
        placeholder: 'e.g. A function that parses ISO dates and returns epoch ms',
        multiline: true,
      },
    ],
    build: (v) =>
      `Write ${v['lang'] ?? ''} code that does the following:\n${v['spec'] ?? ''}`,
  },
];
