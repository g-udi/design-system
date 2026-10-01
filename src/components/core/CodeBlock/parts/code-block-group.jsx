'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../Tabs/index.js';
import { CodeBlock, CodeBlockCopyButton } from './code-block-extended.jsx';

/** The article code chrome: dark in both site themes, drawn from the --ds-color-code-* tokens. */
export const codeChromeClassName = 'dark text-text border-(--ds-color-code-chrome-border) bg-(--ds-color-code-block-bg)';

/**
 * Tabbed code: one tab per item on the code chrome, each a copyable CodeBlock.
 * `items` are `{ title, code, language }` plus any CodeBlock props such as `highlightedLines`.
 */
export function CodeBlockGroup({ items, label = 'Code examples', showLineNumbers = false, className }) {
  if (!items?.length) return null;
  const tabs = items.map((item, index) => ({ ...item, value: String(index), tab: item.title || item.language || `Example ${index + 1}` }));
  return (
    <Tabs defaultValue='0' data-slot='code-block-group' className={cn('gap-0 overflow-hidden rounded-lg border', codeChromeClassName, className)}>
      <TabsList
        aria-label={label}
        tone='accent'
        className='w-full justify-start overflow-x-auto border-b border-(--ds-color-code-chrome-border) bg-(--ds-color-code-chrome-bg) px-2 font-mono'
      >
        {tabs.map(({ value, tab }) => (
          <TabsTrigger key={value} value={value}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(({ value, tab, title, ...block }) => (
        <TabsContent key={value} value={value} className='mt-0'>
          <CodeBlock showLineNumbers={showLineNumbers} {...block} variant='ghost'>
            <CodeBlockCopyButton />
          </CodeBlock>
        </TabsContent>
      ))}
    </Tabs>
  );
}
