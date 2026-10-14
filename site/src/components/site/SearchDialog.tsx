'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDocsSearch } from 'fumadocs-core/search/client';
import Button from '@gaudi/design-system/core/Button';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@gaudi/design-system/core/Commander';
import Icon from '@gaudi/design-system/core/Icon';
import Kbd from '@gaudi/design-system/core/Kbd';
import { useHotkey } from '@gaudi/design-system/hooks';
import { basePath } from '@/lib/nav';
import { useAskAiEnabled } from './ask-ai-context';

// The conversation (chat components, markdown rendering) loads on first use.
const AskAiPanel = dynamic(() => import('./AskAiPanel').then((module) => module.AskAiPanel), { ssr: false });

const plain = (value: unknown) => String(value ?? '').replace(/<\/?[^>]+>/g, '').replace(/[*_`]/g, '');
const KIND_ICON: Record<string, string> = { page: 'FileText', heading: 'Hash', text: 'AlignLeft' };

// Shown before anything is typed.
const STARTER_QUESTIONS = ['How do I install Gaudi in a Next.js app?', 'How do I create a custom theme?', 'Which component should I use for a sortable table?'];
const POPULAR_PAGES = [
  { title: 'Getting started', url: '/docs/getting-started', icon: 'Rocket' },
  { title: 'Theming', url: '/docs/theming', icon: 'Palette' },
  { title: 'Button', url: '/docs/components/button', icon: 'MousePointer2' },
  { title: 'DataTable', url: '/docs/components/data-table', icon: 'Table' },
  { title: 'App Shell', url: '/docs/blocks/app-shell', icon: 'LayoutTemplate' },
  { title: 'Charts', url: '/docs/charts', icon: 'ChartArea' }
];

/**
 * ⌘K search over the Fumadocs static index (every docs page, heading and paragraph). When the
 * deployment has /api/ask, the first row asks the AI the typed question; ⌘I opens the AI directly.
 */
export function SearchDialog() {
  const router = useRouter();
  const askEnabled = useAskAiEnabled();
  const [open, setOpen] = useState(false);
  const [ask, setAsk] = useState<{ open: boolean; question?: string; loaded: boolean }>({ open: false, loaded: false });
  const openAsk = (question?: string) => { setOpen(false); setAsk({ open: true, question, loaded: true }); };
  useHotkey('mod+i', () => askEnabled && openAsk(), { enableInInputs: true });
  const { search, setSearch, query } = useDocsSearch({ type: 'static', from: `${basePath}/api/search` });
  const { ariaKeyShortcuts, kbdKeys } = useHotkey('mod+k', () => setOpen((value: boolean) => !value), { enableInInputs: true });
  const results = query.data && query.data !== 'empty' ? query.data.slice(0, 40) : [];

  const go = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen} title='Search documentation' description='Search every page, heading and paragraph.' trigger={
        <Button
          variant='ghost'
          tone='neutral'
          size='sm'
          aria-keyshortcuts={ariaKeyShortcuts}
          aria-label='Search documentation'
          data-testid='search-trigger'
          className='group min-h-9 justify-start gap-0 p-0 text-sm text-text-muted hover:bg-transparent md:w-56'
        >
          <span className='flex h-8 w-full items-center gap-1.5 rounded-(--ds-radius-control) border border-border px-2 group-hover:bg-surface-muted'>
            <Icon name='Search' decorative size='sm' />
            <span className='me-auto hidden md:inline'>Search…</span>
            <Kbd keys={kbdKeys} size='xs' variant='flat' />
          </span>
        </Button>
      }>
        <Command shouldFilter={false} label='Search documentation'>
          <CommandInput value={search} onValueChange={setSearch} placeholder={askEnabled ? 'Search the docs or ask a question…' : 'Search components, blocks, hooks, themes…'} aria-label='Search query' />
          <CommandList>
            {askEnabled && search.trim() ? (
              <CommandGroup heading='Ask AI'>
                <CommandItem value='ask-ai' onSelect={() => openAsk(search.trim())} data-testid='search-ask-ai'>
                  <Icon name='Sparkles' decorative size='sm' />
                  <span className='min-w-0 flex-1 truncate'>Ask AI: <span className='font-medium'>{search.trim()}</span></span>
                </CommandItem>
              </CommandGroup>
            ) : null}
            {search && query.isLoading ? <p role='status' className='px-3 py-6 text-center text-sm text-text-muted'>Searching…</p> : null}
            {search && !query.isLoading && results.length === 0 ? <CommandEmpty>No results for “{search}”.</CommandEmpty> : null}
            {!search && askEnabled ? (
              <CommandGroup heading='Ask AI'>
                {STARTER_QUESTIONS.map((question) => (
                  <CommandItem key={question} value={`ask:${question}`} onSelect={() => openAsk(question)}>
                    <Icon name='Sparkles' decorative size='sm' />
                    <span className='min-w-0 flex-1 truncate'>{question}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
            {!search ? (
              <CommandGroup heading='Popular pages'>
                {POPULAR_PAGES.map((page) => (
                  <CommandItem key={page.url} value={`page:${page.url}`} onSelect={() => go(page.url)}>
                    <Icon name={page.icon} decorative size='sm' />
                    <span className='min-w-0 flex-1 truncate'>{page.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
            {results.length ? (
              <CommandGroup heading='Results'>
                {results.map((result) => (
                  <CommandItem key={result.id} value={result.id} onSelect={() => go(result.url)} data-testid='search-result'>
                    <Icon name={KIND_ICON[result.type] || 'FileText'} decorative size='sm' />
                    <span className='min-w-0 flex-1'>
                      <span className={result.type === 'page' ? 'block truncate font-medium' : 'block truncate'}>{plain(result.content)}</span>
                      {result.breadcrumbs?.length ? (
                        <span className='block truncate text-xs text-text-muted'>{result.breadcrumbs.map(plain).join(' › ')}</span>
                      ) : null}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </CommandDialog>
      {ask.loaded ? <AskAiPanel open={ask.open} question={ask.question} onOpenChange={(value: boolean) => setAsk((state) => ({ ...state, open: value }))} /> : null}
    </>
  );
}
