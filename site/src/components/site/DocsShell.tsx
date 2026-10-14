'use client';

import type { ReactNode } from 'react';
import type { Root } from 'fumadocs-core/page-tree';
import AppShell from '@gaudi/design-system/blocks/AppShell';
import Icon from '@gaudi/design-system/core/Icon';
import { Brand, HeaderActions, TopNavDropdown, TopNavMenu } from './SiteHeader';
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
        <details className='site-mobile-toc' onClick={(event) => {
          if ((event.target as HTMLElement).closest('a')) event.currentTarget.open = false;
        }}>
          <summary>On this page <Icon name='ChevronDown' decorative size='sm' /></summary>
          {aside}
        </details>
      ) : null}
      {children}
    </AppShell>
  );
}
