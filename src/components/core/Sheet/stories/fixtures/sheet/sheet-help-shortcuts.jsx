'use client';
import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@gaudi/design-system/core/Input';
import { KbdRoot as Kbd, KbdGroup } from '@gaudi/design-system/core/Kbd';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@gaudi/design-system/core/Sheet';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const guides = [
  ['Getting started', [['Write your first article', 'Drafts, cover images and publishing.', 'BookOpenIcon'], ['Invite co-authors', 'Roles and review before publishing.', 'MailIcon']]],
  ['Readers', [['Grow your newsletter', 'Signup forms and the weekly digest.', 'SendIcon'], ['Moderate comments', 'Filters, reports and blocking.', 'MessageCircleIcon']]]
];
const shortcuts = [
  ['General', [['Search', ['⌘', 'K']], ['Open settings', ['⌘', ',']], ['Show shortcuts', ['?']]]],
  ['Editor', [['Bold', ['⌘', 'B']], ['Insert link', ['⌘', 'K']], ['Publish', ['⌘', '⇧', 'P']]]]
];
const matches = (query, ...texts) => texts.join(' ').toLowerCase().includes(query.trim().toLowerCase());

// One search filters guides and shortcuts; each tab keeps its groups.
export function Pattern() {
  const [query, setQuery] = useState('');
  const guideGroups = guides.map(([group, items]) => [group, items.filter(([title, hint]) => matches(query, title, hint))]).filter(([, items]) => items.length);
  const shortcutGroups = shortcuts.map(([group, items]) => [group, items.filter(([label]) => matches(query, label))]).filter(([, items]) => items.length);
  const empty = <p className='text-text-muted py-6 text-center text-sm'>Nothing matches “{query}”.</p>;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='sm' variant='outline'>
          <RegistryIcon lucide='LifeBuoyIcon' aria-hidden='true' />
          Help
        </Button>
      </SheetTrigger>
      <SheetContent inset>
        <SheetHeader>
          <SheetTitle>Help</SheetTitle>
          <SheetDescription>Guides and keyboard shortcuts.</SheetDescription>
        </SheetHeader>
        <div className='grid min-h-0 flex-1 content-start gap-3 overflow-y-auto px-3 pb-3'>
          <InputGroup>
            <InputGroupAddon>
              <RegistryIcon lucide='SearchIcon' aria-hidden='true' />
            </InputGroupAddon>
            <InputGroupInput aria-label='Search help' placeholder='Search guides and shortcuts' value={query} onChange={(event) => setQuery(event.target.value)} />
          </InputGroup>
          <Tabs defaultValue='guides'>
            <TabsList className='w-full'>
              <TabsTrigger value='guides'>Guides</TabsTrigger>
              <TabsTrigger value='shortcuts'>
                <RegistryIcon lucide='KeyboardIcon' aria-hidden='true' />
                Shortcuts
              </TabsTrigger>
            </TabsList>
            <TabsContent value='guides' className='grid gap-4 pt-2'>
              {guideGroups.length
                ? guideGroups.map(([group, items]) => (
                    <section key={group} className='grid gap-1'>
                      <h3 className='text-text-muted text-xs font-medium'>{group}</h3>
                      {items.map(([title, hint, icon]) => (
                        <a key={title} href={`#${title}`} className='hover:bg-surface-muted -mx-2 flex items-start gap-3 rounded-md p-2'>
                          <RegistryIcon lucide={icon} aria-hidden='true' className='text-text-muted mt-0.5 size-4' />
                          <span className='grid gap-0.5 text-sm'>
                            <span className='font-medium'>{title}</span>
                            <span className='text-text-muted'>{hint}</span>
                          </span>
                        </a>
                      ))}
                    </section>
                  ))
                : empty}
            </TabsContent>
            <TabsContent value='shortcuts' className='grid gap-4 pt-2'>
              {shortcutGroups.length
                ? shortcutGroups.map(([group, items]) => (
                    <section key={group} className='grid gap-1.5'>
                      <h3 className='text-text-muted text-xs font-medium'>{group}</h3>
                      {items.map(([label, keys]) => (
                        <div key={label} className='flex items-center justify-between text-sm'>
                          {label}
                          <KbdGroup>
                            {keys.map((key) => (
                              <Kbd key={key}>{key}</Kbd>
                            ))}
                          </KbdGroup>
                        </div>
                      ))}
                    </section>
                  ))
                : empty}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
