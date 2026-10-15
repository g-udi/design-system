'use client';
import { cn } from '../../../utilities/cn/index.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs/index.js';
import { CodeBlock, CodeBlockCopyButton } from './CodeBlock.jsx';
import { codeChromeClassName } from './codeChrome.js';

/**
 * Tabbed code: one tab per item on the code chrome, each a copyable CodeBlock.
 * `items` are `{ title, code, language }` plus any CodeBlock props such as `highlightedLines`.
 */
export function CodeBlockGroup({ items, label = 'Code examples', showLineNumbers = false, className }) {
  if (!items?.length) return null;
  const tabs = items.map((item, index) => ({ ...item, value: String(index), tab: item.title || item.language || `Example ${index + 1}` }));
  return (
    <Tabs defaultValue='0' data-slot='code-block-group' className={cn('gap-0 overflow-hidden rounded-lg border', codeChromeClassName, className)}>
      {/* Compact file tabs in the code chrome, matching a single block's header: sans labels, outlined when active. */}
      <TabsList
        aria-label={label}
        variant='outline'
        className='w-full justify-start overflow-x-auto border-b border-(--ds-color-code-chrome-border) bg-(--ds-color-code-chrome-bg) px-2 py-1.5'
      >
        {tabs.map(({ value, tab }) => (
          <TabsTrigger key={value} value={value} className='h-7 px-2.5 text-xs font-medium'>
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
