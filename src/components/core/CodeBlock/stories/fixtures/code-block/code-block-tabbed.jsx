'use client';
import { CodeBlockGroup } from '@gaudi/design-system/core/CodeBlock';

const install = [
  { title: 'pnpm', language: 'bash', code: 'pnpm add @gaudi/design-system\npnpm add katex mermaid recharts' },
  { title: 'npm', language: 'bash', code: 'npm install @gaudi/design-system\nnpm install katex mermaid recharts' },
  { title: 'yarn', language: 'bash', code: 'yarn add @gaudi/design-system\nyarn add katex mermaid recharts' },
  { title: 'bun', language: 'bash', code: 'bun add @gaudi/design-system\nbun add katex mermaid recharts' }
];
const files = [
  {
    title: 'greeting.tsx',
    language: 'tsx',
    code: `export function Greeting({ name }: { name: string }) {
  return <p>Hello {name}</p>
}`
  },
  {
    title: 'greeting.py',
    language: 'python',
    code: `def greeting(name: str) -> str:
    return f"Hello {name}"`
  },
  {
    title: 'recent.sql',
    language: 'sql',
    code: `select id, email
from users
where created_at > now() - interval '7 days';`
  }
];

export function Pattern() {
  return (
    <div className='grid w-full max-w-2xl gap-6'>
      <CodeBlockGroup label='Install' items={install} />
      <CodeBlockGroup label='Greeting in three languages' items={files} showLineNumbers />
    </div>
  );
}
