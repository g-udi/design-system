'use client';

import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { ButtonGroup } from '@gaudi/design-system/core/ButtonGroup';
import DropdownMenu, { DropdownMenuItem, DropdownMenuSeparator } from '@gaudi/design-system/core/DropdownMenu';
import Icon from '@gaudi/design-system/core/Icon';
import { basePath } from '@/lib/nav';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');

/** Absolute URL of a site path: the configured origin, else the one the page is served from. */
const absolute = (pathname: string) => `${SITE_URL || window.location.origin}${basePath}${pathname}`;

async function copyFrom(url: string) {
  const text = fetch(url).then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  });
  // Safari only allows clipboard writes inside the gesture, so hand it the pending text.
  if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'text/plain': text.then((value) => new Blob([value], { type: 'text/plain' })) })]);
      return;
    } catch { /* fall back to writeText */ }
  }
  await navigator.clipboard.writeText(await text);
}

/** Copy Markdown, plus a menu to view it, open it in an assistant or view the page source. */
export function PageActions({ markdownUrl, sourceUrl }: { markdownUrl: string; sourceUrl: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const copy = async () => {
    try {
      await copyFrom(`${basePath}${markdownUrl}`);
      setState('copied');
    } catch {
      setState('failed');
    }
    setTimeout(() => setState('idle'), 2000);
  };
  const open = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
  const prompt = () => `Read ${absolute(markdownUrl)}, I want to ask questions about it.`;

  return (
    <div className='not-prose mt-4 mb-8 flex flex-wrap items-center gap-2' data-testid='page-actions'>
      <ButtonGroup aria-label='Page actions'>
        <Button variant='outline' tone='neutral' size='sm' onClick={copy} data-testid='copy-markdown'>
          <Icon name={state === 'copied' ? 'Check' : 'Copy'} decorative size='sm' />
          {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy Markdown'}
        </Button>
        <DropdownMenu
          align='start'
          trigger={
            <Button variant='outline' tone='neutral' size='icon-sm' aria-label='More ways to use this page' data-testid='page-actions-menu'>
              <Icon name='ChevronDown' decorative size='sm' />
            </Button>
          }
        >
          <DropdownMenuItem onSelect={() => open(`${basePath}${markdownUrl}`)}>
            <Icon name='markdown' decorative size='sm' />
            View as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => open(`https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt())}`)}>
            <Icon name='MessageCircle' decorative size='sm' />
            Open in ChatGPT
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => open(`https://claude.ai/new?q=${encodeURIComponent(prompt())}`)}>
            <Icon name='Sparkles' decorative size='sm' />
            Open in Claude
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => open(sourceUrl)}>
            <Icon name='Github' decorative size='sm' />
            View source on GitHub
          </DropdownMenuItem>
        </DropdownMenu>
      </ButtonGroup>
      <span role='status' className='sr-only'>{state === 'copied' ? 'Markdown copied' : state === 'failed' ? 'Copy failed' : ''}</span>
    </div>
  );
}
