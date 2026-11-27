'use client';

import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { CardRoot } from '@gaudi/design-system/core/Card';
import { CodeBlock, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle } from '@gaudi/design-system/core/CodeBlock';
import Dialog from '@gaudi/design-system/core/Dialog';
import Icon from '@gaudi/design-system/core/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import { PreviewFrame, PreviewWidthControl, type Viewport } from './PreviewFrame';

export interface ExampleViewProps {
  name: string;
  title: string;
  source: string;
  block: boolean;
  expandable?: boolean;
  storybookUrl: string;
  install: string;
  file: string;
}

/** One pattern: Preview / Code tabs, a responsive frame, RTL, copyable public-import source. */
export function ExampleView({ name, title, source, block, expandable = false, storybookUrl, install, file }: ExampleViewProps) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  const [expanded, setExpanded] = useState(false);
  const controls = (
    <div className='flex flex-wrap items-center gap-1'>
      <PreviewWidthControl title={title} value={viewport} onChange={setViewport} />
      <Button
        variant={dir === 'rtl' ? 'soft' : 'ghost'}
        tone='neutral'
        size='sm'
        aria-pressed={dir === 'rtl'}
        onClick={() => setDir(dir === 'rtl' ? 'ltr' : 'rtl')}
        title='Preview right-to-left'
      >
        RTL
      </Button>
    </div>
  );
  return (
    <CardRoot variant='outline' padding='none' className='not-prose my-4' data-example={name} data-testid='example'>
      <Tabs defaultValue='preview'>
        <div className='site-example-toolbar flex flex-wrap items-center gap-2 border-b border-border px-2 py-1.5'>
          <TabsList aria-label={`${title} views`} className='me-auto'>
            <TabsTrigger value='preview'>Preview</TabsTrigger>
            <TabsTrigger value='code'>Code</TabsTrigger>
          </TabsList>
          {controls}
          <Button
            href={`/preview/${name}`}
            target='_blank'
            rel='noreferrer'
            variant='ghost'
            tone='neutral'
            size='icon-sm'
            aria-label={`Open ${title} in a new tab`}
          >
            <Icon name='ExternalLink' decorative size='sm' />
          </Button>
          <Button
            href={storybookUrl}
            target='_blank'
            rel='noreferrer'
            variant='ghost'
            tone='neutral'
            size='sm'
            aria-label={`View ${title} in Storybook`}
          >
            Storybook
          </Button>
          {expandable ? (
            <Dialog
              variant='bare'
              title={`${title} expanded preview`}
              open={expanded}
              onOpenChange={setExpanded}
              trigger={
                <Button variant='outline' tone='neutral' size='sm'>
                  <Icon name='Maximize2' decorative size='sm' />
                  Expand preview
                </Button>
              }
              className='fixed inset-0 z-[100] flex flex-col bg-background text-text'
            >
              <div className='flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2'>
                <p className='me-auto min-w-0 basis-full text-sm font-medium sm:basis-auto sm:flex-1'>{title}</p>
                {controls}
                <Button variant='outline' tone='neutral' size='sm' onClick={() => setExpanded(false)}>
                  <Icon name='Minimize2' decorative size='sm' />
                  Close preview
                </Button>
              </div>
              <div className='min-h-0 flex-1 overflow-auto'>
                <PreviewFrame name={name} title={title} viewport={viewport} dir={dir} block={block} />
              </div>
            </Dialog>
          ) : null}
        </div>
        <TabsContent value='preview' forceMount className='data-[state=inactive]:hidden'>
          <PreviewFrame name={name} title={title} viewport={viewport} dir={dir} block={block} />
        </TabsContent>
        <TabsContent value='code' className='p-0'>
          <div className='flex flex-col gap-3 p-3'>
            <CodeBlock code={install} language='bash'>
              <CodeBlockHeader>
                <CodeBlockTitle>Add with the shadcn CLI</CodeBlockTitle>
                <CodeBlockCopyButton className='ms-auto' />
              </CodeBlockHeader>
            </CodeBlock>
            <CodeBlock code={source} language='jsx' showLineNumbers maxLines={block ? 40 : 28}>
              <CodeBlockHeader>
                <CodeBlockTitle>{file}</CodeBlockTitle>
                <CodeBlockCopyButton className='ms-auto' />
              </CodeBlockHeader>
            </CodeBlock>
          </div>
        </TabsContent>
      </Tabs>
    </CardRoot>
  );
}
