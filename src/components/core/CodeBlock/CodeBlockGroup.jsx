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
       * Editor tabs: the active file tab, marked by an accent top edge, opens into the code below it. The bar's
       * bottom rule is an inset shadow so the active tab paints over it; a border would sit on top.
       */}
      <TabsList
        aria-label={label}
        variant='type'
        className='w-full items-end justify-start gap-0.5 overflow-x-auto bg-(--ds-color-code-chrome-bg) px-2 pt-2 pb-0 shadow-[inset_0_-1px_0_var(--ds-color-code-chrome-border)]'
      >
        {tabs.map(({ value, tab }) => (
          <TabsTrigger
            key={value}
            value={value}
            className='h-8 rounded-b-none rounded-t-md border border-b-0 border-transparent px-3 text-xs font-medium text-(--ds-color-code-tab-text) hover:text-(--ds-color-code-tab-text-hover) data-[state=active]:border-(--ds-color-code-chrome-border) data-[state=active]:bg-(--ds-color-code-block-bg) data-[state=active]:text-text data-[state=active]:shadow-[inset_0_2px_0_var(--ds-color-accent)]'
          >
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
