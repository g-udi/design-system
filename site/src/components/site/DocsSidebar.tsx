'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gaudi/design-system/core/Accordion';
import Icon from '@gaudi/design-system/core/Icon';
import { useSessionStorage } from '@gaudi/design-system/hooks/data/use-session-storage';
import { useMediaQuery } from '@gaudi/design-system/hooks/environment/use-media-query';
import { useIsomorphicLayoutEffect } from '@gaudi/design-system/hooks/state/use-isomorphic-layout-effect';
import type { Folder, Item, Node, Root } from 'fumadocs-core/page-tree';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider
} from '@gaudi/design-system/blocks/AppShell';

const normalize = (url: string) => url.replace(/\/$/, '') || '/';
// The route remounts the shell; keep each navigation surface where the reader left it.
const scrollPositions = { rail: 0, drawer: 0 };

// Guide folders share one section; every other top-level folder is a library section.
const GUIDE_FOLDERS = ['/docs/getting-started', '/docs/foundations', '/docs/theming', '/docs/ai'];
const LIBRARY_PREFIXES = [
  '/docs/components',
  '/docs/blocks',
  '/docs/chat',
  '/docs/charts',
  '/docs/hooks',
  '/docs/animations',
  '/docs/mdx',
  '/docs/layout'
];

type Entry = { kind: 'page'; name: React.ReactNode; url: string } | { kind: 'heading'; name: React.ReactNode };
type Section = { id: string; title: React.ReactNode; entries: Entry[] };

const folderUrl = (folder: Folder) => folder.index?.url || (folder.children.find((child) => child.type === 'page') as Item | undefined)?.url || '';

/** Flattens a folder into pages and quiet sub-headings (separators and nested folders). */
function flatten(nodes: Node[]): Entry[] {
  return nodes.flatMap((node): Entry[] => {
    if (node.type === 'separator') return [{ kind: 'heading', name: node.name }];
    if (node.type === 'folder') return [{ kind: 'heading', name: node.name }, ...(node.index ? [{ kind: 'page' as const, name: 'Overview', url: node.index.url }] : []), ...flatten(node.children)];
    return [{ kind: 'page', name: node.name, url: node.url }];
  });
}

/** Builds the Intro, Guides and library sections from the Fumadocs page tree. */
function buildSections(tree: Root): Section[] {
  const intro: Entry[] = [];
  const guides: Entry[] = [];
  const libraries: Section[] = [];
  for (const node of tree.children) {
    if (node.type === 'page') intro.push({ kind: 'page', name: node.name, url: node.url });
    else if (node.type === 'folder') {
      const url = normalize(folderUrl(node));
      const root = GUIDE_FOLDERS.find((prefix) => url.startsWith(prefix));
      if (root) guides.push({ kind: 'heading', name: node.name }, ...(node.index ? [{ kind: 'page' as const, name: 'Overview', url: node.index.url }] : []), ...flatten(node.children));
      else {
        const prefix = LIBRARY_PREFIXES.find((key) => url.startsWith(key));
        libraries.push({ id: prefix || String(node.$id), title: node.name, entries: [...(node.index ? [{ kind: 'page' as const, name: 'Overview', url: node.index.url }] : []), ...flatten(node.children)] });
      }
    }
  }
  return [{ id: 'intro', title: 'Intro', entries: intro }, { id: 'guides', title: 'Guides', entries: guides }, ...libraries];
}

const pageCount = (section: Section) => section.entries.filter((entry) => entry.kind === 'page' && entry.name !== 'Overview').length;

const containsPage = (section: Section, current: string) => section.entries.some((entry) => entry.kind === 'page' && normalize(entry.url) === current);

function Entries({ section, current }: { section: Section; current: string }) {
  return (
    <SidebarMenu className='gap-px'>
      {section.entries.map((entry, index) => entry.kind === 'heading'
        ? <li key={`h-${index}`} className='px-3 pt-4 pb-1.5 text-xs font-medium text-text-subtle first:pt-1'>{entry.name}</li>
        : (
          <SidebarMenuItem key={entry.url}>
            <SidebarMenuButton asChild isActive={normalize(entry.url) === current}
              className='h-8 rounded-(--ds-radius-control) px-3 text-sm text-text-muted hover:bg-surface hover:text-text data-active:bg-surface data-active:font-medium data-active:text-text'>
              <Link href={entry.url} aria-current={normalize(entry.url) === current ? 'page' : undefined}>{entry.name}</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </SidebarMenu>
  );
}

/** A collapsible section: a labelled trigger with the page count, then its pages. */
function CollapsibleSection({ section, current, open, onOpenChange }: { section: Section; current: string; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <SidebarGroup className='p-0'>
        <SidebarGroupLabel asChild className='h-9 w-full gap-2 rounded-(--ds-radius-control) px-3 text-[0.8125rem] font-semibold text-text hover:bg-surface'>
          <CollapsibleTrigger>
            <span className='min-w-0 flex-1 truncate text-start'>{section.title}</span>
            <span className='text-xs font-normal text-text-subtle tabular-nums'>{pageCount(section)}</span>
            <Icon name='ChevronRight' decorative size='xs' className={`shrink-0 text-text-subtle transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-90' : ''}`} />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent className='ms-3 w-auto ps-1.5 pt-0.5 pb-2'>
            <Entries section={section} current={current} />
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

/** The docs navigation: every page in one list under Intro, Guides and library headings, using Gaudi's sidebar parts. */
export function DocsSidebar({ tree }: { tree: Root }) {
  const current = normalize(usePathname() || '/');
  const compact = useMediaQuery('(max-width: 1023px)');
  const sections = buildSections(tree);
  const [intro, ...collapsible] = sections;
  // Only the section holding the current page starts open; choices persist for the session.
  const [overrides, setOverrides] = useSessionStorage('gaudi-docs-sidebar', {} as Record<string, boolean>);
  const activeId = collapsible.find((section) => containsPage(section, current))?.id;
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Keep visited sections open, so changing pages does not collapse earlier rows.
    if (activeId) setOverrides((previous: Record<string, boolean>) => previous[activeId] === true ? previous : { ...previous, [activeId]: true });
  }, [activeId, setOverrides]);
  useIsomorphicLayoutEffect(() => {
    const scroller = list.current?.closest<HTMLElement>('.ds-app-rail, .ds-app-navigation-scroll');
    if (!scroller?.clientHeight) return;
    const surface = scroller.classList.contains('ds-app-rail') ? 'rail' : 'drawer';
    scroller.scrollTop = scrollPositions[surface];
    const remember = () => { scrollPositions[surface] = scroller.scrollTop; };
    scroller.addEventListener('scroll', remember, { passive: true });
    return () => scroller.removeEventListener('scroll', remember);
  }, [compact]);
  return (
    <SidebarProvider className='site-sidebar block min-h-0'>
      <div ref={list} className='flex flex-col gap-1'>
        <SidebarGroup className='p-0 pb-2'>
          <SidebarGroupContent><Entries section={intro} current={current} /></SidebarGroupContent>
        </SidebarGroup>
        {collapsible.map((section) => (
          <CollapsibleSection key={section.id} section={section} current={current}
            open={overrides[section.id] ?? section.id === activeId}
            onOpenChange={(open) => setOverrides({ ...overrides, [section.id]: open })} />
        ))}
      </div>
    </SidebarProvider>
  );
}
