'use client';

import { useState, type ReactNode } from 'react';
import type { Root } from 'fumadocs-core/page-tree';
import AppShell from '@gaudi/design-system/blocks/AppShell';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gaudi/design-system/core/Accordion';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';
import { Brand, HeaderActions, TopNavDropdown, TopNavMenu } from './SiteHeader';
import { DocsSidebar } from './DocsSidebar';

/** Docs frame: Gaudi's AppShell (skip link, rail, phone sheet, header, main, detail rail). */
export function DocsShell({ tree, aside, children }: { tree: Root; aside?: ReactNode; children: ReactNode }) {
  const [contentsOpen, setContentsOpen] = useState(false);
  return (
    <AppShell
      className='site-docs'
      brand={<Brand />}
      navigationLabel='Documentation'
      menuLabel='Open documentation navigation'
      navigation={
        <>
          <TopNavDropdown />
          <DocsSidebar tree={tree} />
        </>
      }
      header={
        <>
          <span className='lg:hidden'><Brand /></span>
          <TopNavMenu className='hidden xl:flex' />
          <HeaderActions />
        </>
      }
      aside={aside}
      asideLabel='On this page'
    >
      {aside ? (
        <Collapsible className='site-mobile-toc' open={contentsOpen} onOpenChange={setContentsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant='ghost' tone='neutral' className='min-h-11 w-full justify-between'>
              On this page <Icon name='ChevronDown' decorative size='sm' />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent onClick={(event: React.MouseEvent) => {
            if ((event.target as HTMLElement).closest('a')) setContentsOpen(false);
          }}>
            {aside}
          </CollapsibleContent>
        </Collapsible>
      ) : null}
      {children}
    </AppShell>
  );
}
