'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { AppShellFrame } from '../../../../src/components/blocks/AppShell/parts/frame.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const SECTIONS = [
  {
    id: 'start',
    label: 'Getting started',
    items: [
      { id: 'install', label: 'Installation' },
      { id: 'structure', label: 'Project structure' },
      { id: 'theming', label: 'Theming' }
    ]
  },
  {
    id: 'components',
    label: 'Components',
    items: [
      {
        id: 'sidebar',
        label: 'Sidebar',
        children: [
          { id: 'anatomy', label: 'Anatomy', isActive: true },
          { id: 'collapsing', label: 'Collapsing' },
          { id: 'sub-menus', label: 'Sub-menus' }
        ]
      },
      {
        id: 'data-grid',
        label: 'Data grid',
        children: [
          { id: 'columns', label: 'Columns' },
          { id: 'row-selection', label: 'Row selection' },
          { id: 'virtualisation', label: 'Virtualisation' }
        ]
      },
      {
        id: 'filters',
        label: 'Filters',
        children: [
          { id: 'operators', label: 'Operators' },
          { id: 'async-options', label: 'Async options' }
        ]
      },
      { id: 'calendar', label: 'Calendar' }
    ]
  },
  {
    id: 'api',
    label: 'API reference',
    items: [
      {
        id: 'provider',
        label: 'Provider props',
        children: [
          { id: 'open-state', label: 'Open state' },
          { id: 'widths', label: 'Widths' }
        ]
      },
      {
        id: 'hooks',
        label: 'Hooks',
        children: [{ id: 'use-sidebar', label: 'useSidebar' }]
      },
      { id: 'tokens', label: 'CSS variables' }
    ]
  }
];
function matches(label, query) {
  return label.toLowerCase().includes(query);
}
function filterItems(items, query) {
  if (!query) {
    return items;
  }
  return items
    .map((item) =>
      matches(item.label, query)
        ? item
        : {
            ...item,
            children: item.children?.filter((child) =>
              matches(child.label, query)
            )
          }
    )
    .filter(
      (item) => matches(item.label, query) || (item.children?.length ?? 0) > 0
    );
}
function BrandMark({ className }) {
  return (
    <span
      aria-hidden='true'
      className={cn(
        'bg-ui-sidebar-primary text-ui-sidebar-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-md',
        className
      )}
    >
      <svg
        viewBox='25.5002 25.1352 50 50'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='size-3'
      >
        <circle cx='70.634' cy='29.8334' r='4.69799' fill='currentColor' />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M25.668 57.0144V29.8332C25.668 27.2386 27.7713 25.1352 30.366 25.1352C32.9606 25.1352 35.0639 27.2386 35.0639 29.8332V57.0144C35.0639 61.833 38.9702 65.7392 43.7888 65.7392H57.2116C62.0302 65.7392 65.9364 61.833 65.9364 57.0144V43.7258C65.9364 41.1312 68.0398 39.0278 70.6344 39.0278C73.229 39.0278 75.3324 41.1312 75.3324 43.7258V57.0144C75.3324 67.0222 67.2194 75.1352 57.2116 75.1352H43.7888C33.7809 75.1352 25.668 67.0222 25.668 57.0144Z'
          fill='currentColor'
        />
      </svg>
    </span>
  );
}
function Chevron({ open }) {
  return (
    <RegistryIcon
      lucide='ChevronRightIcon'
      className={cn(
        'ml-auto size-4 shrink-0 opacity-60 transition-transform duration-200',
        open && 'rotate-90'
      )}
      aria-hidden='true'
    />
  );
}
function DocsNavItem({ item, forceOpen }) {
  const [open, setOpen] = useState(
    () => item.children?.some((child) => child.isActive) ?? false
  );
  if (!item.children || item.children.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={item.isActive}>
          <a href='#'>
            <span>{item.label}</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
  const expanded = forceOpen || open;
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        type='button'
        onClick={() => setOpen((value) => !value)}
        aria-expanded={expanded}
        aria-controls={`docs-sub-${item.id}`}
      >
        <span className='min-w-0 flex-1 truncate'>{item.label}</span>
        <Chevron open={expanded} />
      </SidebarMenuButton>
      {expanded ? (
        <SidebarMenuSub id={`docs-sub-${item.id}`}>
          {item.children.map((child) => (
            <SidebarMenuSubItem key={child.id}>
              <SidebarMenuSubButton asChild isActive={child.isActive}>
                <a href='#'>
                  <span>{child.label}</span>
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      ) : null}
    </SidebarMenuItem>
  );
}
function DocsSection({ section, items, filtering }) {
  const [open, setOpen] = useState(() =>
    section.items.some(
      (item) => item.isActive || item.children?.some((child) => child.isActive)
    )
  );
  const expanded = filtering || open;
  return (
    <Collapsible open={expanded} onOpenChange={setOpen}>
      <SidebarGroup>
        <SidebarGroupLabel
          asChild
          className='hover:bg-ui-sidebar-accent hover:text-ui-sidebar-accent-foreground w-full'
        >
          <CollapsibleTrigger>
            <span className='min-w-0 flex-1 truncate text-start'>
              {section.label}
            </span>
            <Chevron open={expanded} />
          </CollapsibleTrigger>
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <DocsNavItem key={item.id} item={item} forceOpen={filtering} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}
export function Pattern() {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const visible = SECTIONS.map((section) => ({
    section,
    items: filterItems(section.items, needle)
  })).filter((entry) => entry.items.length > 0);
  return (
    <AppShellFrame>
      <SidebarProvider className='h-full min-h-0 w-full overflow-hidden'>
        <Sidebar collapsible='none'>
          <SidebarHeader>
            <div className='flex items-center gap-2'>
              <BrandMark />
              <span className='truncate text-sm font-medium'>Gaudi Docs</span>
              <span className='text-ui-sidebar-foreground ml-auto shrink-0 text-xs'>
                v2.8
              </span>
            </div>
            <label htmlFor='docs-search' className='sr-only'>
              Search the documentation
            </label>
            <SidebarInput
              id='docs-search'
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder='Search docs'
            />
          </SidebarHeader>

          <SidebarContent role='navigation' aria-label='Documentation'>
            {visible.map((entry) => (
              <DocsSection
                key={entry.section.id}
                section={entry.section}
                items={entry.items}
                filtering={needle !== ''}
              />
            ))}
            {visible.length === 0 ? (
              <p className='text-ui-sidebar-foreground px-4 py-6 text-center text-xs'>
                No pages match{' '}
                <span className='text-ui-sidebar-foreground'>{query}</span>.
              </p>
            ) : null}
          </SidebarContent>
        </Sidebar>

        <SidebarInset className='min-w-0 overflow-auto'>
          <article className='mx-auto w-full max-w-2xl px-6 py-6'>
            <h1 className='text-xl font-semibold tracking-tight'>
              Sidebar anatomy
            </h1>
            <p className='text-ui-muted-foreground mt-2 text-sm'>
              A sidebar is a provider, a panel and the inset beside it. The
              provider owns the open state and the widths, the panel owns the
              navigation, and the inset is the page the reader came for.
            </p>

            <h2 className='mt-6 text-base font-medium'>Where the parts go</h2>
            <p className='text-ui-muted-foreground mt-2 text-sm'>
              Header and footer are pinned; only the content between them scrolls.
              Groups carry the labels, menus carry the rows, and a sub-menu nests
              one level under the row that owns it.
            </p>
            <p className='text-ui-muted-foreground mt-2 text-sm'>
              Keep the panel to one job. A tree that needs three levels of
              indentation usually wants a page of its own.
            </p>

            <ul className='text-ui-muted-foreground mt-4 flex list-disc flex-col gap-1.5 ps-5 text-sm'>
              <li>One landmark per panel, labelled for screen readers.</li>
              <li>
                Every disclosure reports aria-expanded and what it controls.
              </li>
              <li>The current page is marked once, at the deepest level.</li>
            </ul>
          </article>
        </SidebarInset>
      </SidebarProvider>
    </AppShellFrame>
  );
}
