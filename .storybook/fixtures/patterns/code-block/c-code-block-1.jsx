'use client';
import { useState } from 'react';
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle
} from '../../../../src/components/core/CodeBlock/parts/code-block-extended.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import {
  ScrollArea,
  ScrollBar
} from '../../../../src/components/core/ScrollArea/parts/scroll-area.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
const code = `export function useTotals(items: Item[], currency = "EUR") {
  return useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = Math.round(subtotal * 0.2)
    const label = new Intl.NumberFormat("en-GB", { style: "currency", currency, minimumFractionDigits: 2 }).format(subtotal + tax)
    return { subtotal, tax, total: subtotal + tax, label }
  }, [items, currency])
}

export function formatSeatSummary(seats: number, used: number) {
  return \`\${used} of \${seats} seats in use, \${Math.max(0, seats - used)} remaining\`
}

export function canInviteMember(seats: number, used: number) {
  return used < seats
}`;
/* Syntax colours from design tokens: the css-variables theme reads
   --code-token-* and each variable maps to a palette step per theme. */
const tokenPalette = [
  '[--code-token-keyword:var(--color-rose-600)]',
  '[--code-token-function:var(--color-violet-600)]',
  '[--code-token-string:var(--color-emerald-600)]',
  '[--code-token-string-expression:var(--color-emerald-600)]',
  '[--code-token-constant:var(--color-sky-600)]',
  '[--code-token-parameter:var(--color-amber-600)]',
  '[--code-token-comment:var(--muted-foreground)]',
  '[--code-token-punctuation:var(--foreground)]',
  '[--code-foreground:var(--foreground)]',
  'dark:[--code-token-keyword:var(--color-rose-400)]',
  'dark:[--code-token-function:var(--color-violet-400)]',
  'dark:[--code-token-string:var(--color-emerald-400)]',
  'dark:[--code-token-string-expression:var(--color-emerald-400)]',
  'dark:[--code-token-constant:var(--color-sky-400)]',
  'dark:[--code-token-parameter:var(--color-amber-400)]'
].join(' ');
const switches = [
  { key: 'header', label: 'Header' },
  { key: 'lineNumbers', label: 'Line numbers' },
  { key: 'wrap', label: 'Wrap long lines' }
];
export function Pattern() {
  const [options, setOptions] = useState({
    header: true,
    lineNumbers: true,
    wrap: false
  });
  const [theme, setTheme] = useState('default');
  const dark = theme === 'dark';
  return (
    <div className='flex w-full max-w-2xl flex-col gap-3'>
      <div
        role='group'
        aria-label='Code block options'
        className='flex flex-wrap items-center gap-x-4 gap-y-2'
      >
        {switches.map((option) => (
          <Label key={option.key} className='gap-2 text-sm font-normal'>
            <Switch
              size='sm'
              checked={options[option.key]}
              onCheckedChange={(checked) =>
                setOptions((current) => ({ ...current, [option.key]: checked }))
              }
            />
            {option.label}
          </Label>
        ))}
        <ToggleGroup
          aria-label='Syntax theme'
          variant='outline'
          size='sm'
          spacing={0}
          type='single'
          value={theme}
          onValueChange={(next) => setTheme(next || theme)}
          className='ml-auto'
        >
          <ToggleGroupItem value='default'>Default</ToggleGroupItem>
          <ToggleGroupItem value='tokens'>Design tokens</ToggleGroupItem>
          <ToggleGroupItem value='dark'>Always dark</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* `dark` on a wrapper keeps the block dark in both site themes. */}
      <div className={cn(dark && 'dark')}>
        <CodeBlock
          code={code}
          language='typescript'
          showLineNumbers={options.lineNumbers}
          wrap={options.wrap}
          themes={
            theme === 'tokens'
              ? { light: 'css-variables', dark: 'css-variables' }
              : undefined
          }
          className={cn(theme === 'tokens' && tokenPalette)}
        >
          {options.header ? (
            <CodeBlockHeader>
              {dark && (
                <span
                  aria-hidden='true'
                  className='flex shrink-0 items-center gap-1.5'
                >
                  <span className='size-2.5 rounded-full bg-[#ff5f57]' />
                  <span className='size-2.5 rounded-full bg-[#febc2e]' />
                  <span className='size-2.5 rounded-full bg-[#28c840]' />
                </span>
              )}
              <CodeBlockTitle>use-totals.ts</CodeBlockTitle>
              <CodeBlockLanguage />
              <CodeBlockCopyButton className='ml-auto' />
            </CodeBlockHeader>
          ) : (
            /* Without a header the copy button pins over the code. */
            <CodeBlockCopyButton
              variant='outline'
              size='icon-sm'
              className='bg-ui-card hover:bg-ui-muted'
            />
          )}
          {/* The cap goes on the ScrollArea viewport, not its root: a
           percentage height against a max-height parent resolves to auto,
           so a root-level cap clips without ever scrolling. */}
          <ScrollArea className='rounded-[inherit] **:data-[slot=scroll-area-viewport]:max-h-56'>
            <CodeBlockContent />
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </CodeBlock>
      </div>
    </div>
  );
}
