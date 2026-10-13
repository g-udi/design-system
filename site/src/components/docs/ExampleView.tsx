'use client';

import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import { CodeBlock, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle } from '@gaudi/design-system/core/CodeBlock';
import Icon from '@gaudi/design-system/core/Icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';
import { basePath } from '@/lib/nav';
import { PreviewFrame, type Viewport } from './PreviewFrame';

export interface ExampleViewProps {
  name: string;
  title: string;
  source: string;
  block: boolean;
  storybookUrl: string;
  install: string;
  file: string;
}

const viewportOptions = [
  { value: 'desktop', label: <><Icon name='Laptop' decorative size='sm' /><span className='sr-only'>Desktop</span></> },
  { value: 'tablet', label: <><Icon name='Tablet' decorative size='sm' /><span className='sr-only'>Tablet (768px)</span></> },
  { value: 'mobile', label: <><Icon name='Smartphone' decorative size='sm' /><span className='sr-only'>Mobile (375px)</span></> }
];

/** One pattern: Preview / Code tabs, a responsive frame, RTL, copyable public-import source. */
export function ExampleView({ name, title, source, block, storybookUrl, install, file }: ExampleViewProps) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  return (
    <div className='not-prose my-4 overflow-hidden rounded-(--ds-radius-card) border border-border bg-background' data-example={name} data-testid='example'>
      <Tabs defaultValue='preview'>
        <div className='flex flex-wrap items-center gap-2 border-b border-border px-2 py-1.5'>
          <TabsList aria-label={`${title} views`} className='me-auto'>
            <TabsTrigger value='preview'>Preview</TabsTrigger>
            <TabsTrigger value='code'>Code</TabsTrigger>
          </TabsList>
          <div className='flex flex-wrap items-center gap-1'>
            <ToggleGroup
              type='single'
              size='sm'
              label={`${title} preview width`}
              value={viewport}
              onValueChange={(value: string) => value && setViewport(value as Viewport)}
              options={viewportOptions}
            />
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
            <Button href={`${basePath}/preview/${name}`} target='_blank' rel='noreferrer' variant='ghost' tone='neutral' size='icon-sm' aria-label={`Open ${title} in a new tab`}>
              <Icon name='ExternalLink' decorative size='sm' />
            </Button>
            <Button href={storybookUrl} target='_blank' rel='noreferrer' variant='ghost' tone='neutral' size='sm' aria-label={`View ${title} in Storybook`}>
              Storybook
            </Button>
          </div>
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
    </div>
  );
}
