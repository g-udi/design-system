'use client';

import type { ReactNode } from 'react';
import type { Root } from 'fumadocs-core/page-tree';
import AppShell from '@gaudi/design-system/blocks/AppShell';
import { Brand, HeaderActions, TopNavLinks, TopNavMenu } from './SiteHeader';
import { DocsSidebar } from './DocsSidebar';

/** Docs frame: Gaudi's AppShell (skip link, rail, phone sheet, header, main, detail rail). */
export function DocsShell({ tree, aside, children }: { tree: Root; aside?: ReactNode; children: ReactNode }) {
  return (
    <AppShell
      className='site-docs'
      brand={<Brand />}
      navigationLabel='Documentation'
      menuLabel='Open documentation navigation'
      navigation={
        <>
          <TopNavLinks className='mb-4 border-b border-border pb-3 xl:hidden [&_ul]:flex-wrap' />
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
      {children}
    </AppShell>
  );
}
