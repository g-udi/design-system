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
      {/*
       * The divider is an inset shadow at the bar's foot and the bar has no bottom padding, so the active
       * underline lands exactly on the divider above the code instead of floating over it.
       */}
      <TabsList
        aria-label={label}
        tone='accent'
        className='w-full justify-start overflow-x-auto bg-(--ds-color-code-chrome-bg) px-2 pt-1 pb-0 font-mono shadow-[inset_0_-1px_0_var(--ds-color-code-chrome-border)]'
      >
        {tabs.map(({ value, tab }) => (
          <TabsTrigger key={value} value={value} className='h-10'>
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
