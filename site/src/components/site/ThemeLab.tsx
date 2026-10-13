'use client';

import { useMemo, useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { CodeBlock, CodeBlockCopyButton, CodeBlockDownloadButton, CodeBlockHeader, CodeBlockTitle } from '@gaudi/design-system/core/CodeBlock';
import Textarea from '@gaudi/design-system/core/Textarea';
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';
import { exportTheme, importTheme, THEME_EXPORT_FORMATS, useTheme } from '@gaudi/design-system/themes';

const SAMPLE = `:root {
  --background: oklch(0.99 0.01 95);
  --foreground: oklch(0.24 0.03 260);
  --primary: oklch(0.55 0.17 160);
  --primary-foreground: oklch(0.99 0 0);
  --muted: oklch(0.96 0.01 95);
  --muted-foreground: oklch(0.48 0.02 260);
  --border: oklch(0.9 0.01 95);
  --radius: 0.5rem;
}
.dark {
  --background: oklch(0.2 0.02 260);
  --foreground: oklch(0.96 0.01 95);
  --primary: oklch(0.72 0.15 160);
  --primary-foreground: oklch(0.2 0.02 260);
  --muted: oklch(0.27 0.02 260);
  --muted-foreground: oklch(0.75 0.02 260);
  --border: oklch(0.32 0.02 260);
}`;

const LANGUAGE: Record<string, string> = { json: 'json', css: 'css', shadcn: 'css', registry: 'json' };

interface ImportResult { theme: { id: string; name: string }; format: string; warnings: string[]; report: { pass: boolean; checked: number; failures: unknown[] } }

/** Paste StyleGlide / tweakcn / shadcn CSS (or Gaudi JSON) to apply it; export the active theme. */
export function ThemeLab() {
  const { theme, themes, applyCustomTheme } = useTheme();
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<{ tone: 'success' | 'danger'; text: string; warnings?: string[] } | null>(null);
  const [format, setFormat] = useState<string>('shadcn');
  const active = themes.find((entry: { id: string }) => entry.id === theme) || themes[0];
  const exported = useMemo(() => {
    try { return exportTheme(active, format); } catch (error) { return `/* ${(error as Error).message} */`; }
  }, [active, format]);

  const apply = () => {
    try {
      const result = importTheme(input || SAMPLE, { id: 'imported', name: 'Imported theme', repair: true }) as ImportResult;
      applyCustomTheme(result.theme);
      setStatus({
        tone: 'success',
        text: `Applied “${result.theme.name}” (${result.format}). Contrast: ${result.report.pass ? 'all' : `${result.report.checked - result.report.failures.length} of`} ${result.report.checked} pairs pass.`,
        warnings: result.warnings
      });
    } catch (error) {
      setStatus({ tone: 'danger', text: (error as Error).message });
    }
  };

  return (
    <div className='grid gap-6 lg:grid-cols-2'>
      <section aria-labelledby='import-title' className='flex min-w-0 flex-col gap-3'>
        <h2 id='import-title' className='text-xl font-semibold'>Import</h2>
        <p className='text-sm text-text-muted'>
          Paste theme CSS from <a className='text-accent underline' href='https://www.styleglide.ai/themes' target='_blank' rel='noreferrer'>StyleGlide</a>,{' '}
          <a className='text-accent underline' href='https://tweakcn.com' target='_blank' rel='noreferrer'>tweakcn</a> or{' '}
          <a className='text-accent underline' href='https://ui.shadcn.com/themes' target='_blank' rel='noreferrer'>shadcn/ui themes</a>, a shadcn registry item, or Gaudi theme JSON.
          It is mapped with <code>importTheme</code>, contrast-repaired, applied to the whole site and kept in local storage.
        </p>
        <label htmlFor='theme-input' className='text-sm font-medium'>Theme CSS or JSON</label>
        <Textarea id='theme-input' rows={14} className='font-mono text-xs' placeholder={SAMPLE} value={input} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)} data-testid='theme-input' />
        <div className='flex flex-wrap gap-2'>
          <Button onClick={apply} data-testid='apply-theme'>{input ? 'Import and apply' : 'Apply the sample'}</Button>
          <Button variant='outline' tone='neutral' onClick={() => setInput(SAMPLE)}>Paste sample</Button>
        </div>
        {status ? (
          <div role='status' className={`rounded-(--ds-radius-card) border p-3 text-sm ${status.tone === 'success' ? 'border-success-border bg-success-subtle' : 'border-danger-border bg-danger-subtle'}`}>
            <p>{status.text}</p>
            {status.warnings?.length ? <ul className='mt-1 list-disc ps-5 text-xs'>{status.warnings.slice(0, 5).map((warning) => <li key={warning}>{warning}</li>)}</ul> : null}
          </div>
        ) : null}
      </section>
      <section aria-labelledby='export-title' className='flex min-w-0 flex-col gap-3'>
        <h2 id='export-title' className='text-xl font-semibold'>Export</h2>
        <p className='text-sm text-text-muted'>The active theme (<strong>{active?.name}</strong>) through <code>exportTheme</code>.</p>
        <ToggleGroup type='single' size='sm' label='Export format' value={format} onValueChange={(value: string) => value && setFormat(value)} options={THEME_EXPORT_FORMATS.map((value: string) => ({ value, label: value }))} />
        <CodeBlock code={exported} language={LANGUAGE[format] || 'css'} maxLines={24} showLineNumbers>
          <CodeBlockHeader>
            <CodeBlockTitle>{`${active?.id}.${format === 'json' || format === 'registry' ? 'json' : 'css'}`}</CodeBlockTitle>
            <CodeBlockDownloadButton className='ms-auto' filename={`${active?.id}-${format}.${format === 'json' || format === 'registry' ? 'json' : 'css'}`} />
            <CodeBlockCopyButton />
          </CodeBlockHeader>
        </CodeBlock>
      </section>
    </div>
  );
}
