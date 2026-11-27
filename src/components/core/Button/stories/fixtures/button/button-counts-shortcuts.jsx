'use client';
import { Toggle } from '@gaudi/design-system/core/ToggleGroup';
import { Command, CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList } from '@gaudi/design-system/core/Commander';
import EmptyState from '@gaudi/design-system/core/EmptyState';
import { useRef, useState } from 'react';
import Dialog from '@gaudi/design-system/core/Dialog';
import Input from '@gaudi/design-system/core/Input';
import { Label } from '@gaudi/design-system/core/Field';
import { useHotkey } from '@gaudi/design-system/hooks';
import { Badge, StatusDot } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import Kbd from '@gaudi/design-system/core/Kbd';
import {
  TooltipRoot as Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gaudi/design-system/core/Tooltip';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const messages = ['New review on the mobile navigation', 'Editor handoff for Friday', 'November component notes'];
const updates = [
  'Timeline now groups timestamps and descriptions.',
  'The documentation search index has been refreshed.'
];
const alerts = ['Review requested on the library rail', 'Two new examples are ready to try'];
const activity = {
  Messages: messages,
  Inbox: messages,
  Updates: updates,
  Notifications: alerts,
  Deployment: ['Documentation published successfully.']
};

export function Pattern() {
  const root = useRef(null);
  const [liked, setLiked] = useState(false);
  const [starred, setStarred] = useState(false);
  const [panel, setPanel] = useState('');
  const [query, setQuery] = useState('');
  const open = (next) => {
    setQuery('');
    setPanel(next);
  };
  const search = useHotkey('mod+k', () => open('Search'), { target: root });
  const palette = useHotkey('mod+p', () => open('Command palette'), { target: root });
  const entries = activity[panel] || [...new Set(Object.values(activity).flat())];
  const visible = entries.filter((entry) => entry.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <TooltipProvider>
      <div ref={root} className='mx-auto flex w-full max-w-2xl flex-col gap-3'>
        <div className='flex flex-wrap items-center gap-2'>
          <Toggle pressed={liked} onPressedChange={setLiked}>
            <RegistryIcon lucide='ThumbsUpIcon' aria-hidden='true' />
            Like
            <Badge size='xs' variant='secondary'>
              {liked ? 457 : 456}
            </Badge>
          </Toggle>
          <Toggle variant='outline' pressed={starred} onPressedChange={setStarred}>
            <RegistryIcon lucide='StarIcon' aria-hidden='true' />
            Star
            <Badge size='xs' variant='secondary'>
              {starred ? 590 : 589}
            </Badge>
          </Toggle>
          <Button variant='outline' aria-label={`Messages (${messages.length})`} onClick={() => open('Messages')}>
            Messages
            <Badge variant='destructive-outline' size='sm' aria-hidden='true'>
              {messages.length}
            </Badge>
          </Button>
          <Button aria-label='Updates (new)' onClick={() => open('Updates')}>
            Updates
            <Badge variant='success' size='xs' aria-hidden='true'>
              New
            </Badge>
          </Button>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <Button
            variant='outline'
            className='relative'
            aria-label={`Inbox (${messages.length})`}
            onClick={() => open('Inbox')}
          >
            <RegistryIcon lucide='MailIcon' aria-hidden='true' />
            Inbox
            <Badge variant='destructive' size='sm' className='absolute -top-1.5 -right-2 px-1' aria-hidden='true'>
              {messages.length}
            </Badge>
          </Button>
          <Button
            size='icon'
            variant='outline'
            className='relative'
            aria-label={`Notifications (${alerts.length})`}
            onClick={() => open('Notifications')}
          >
            <RegistryIcon lucide='BellIcon' aria-hidden='true' />
            <Badge variant='destructive' size='xs' className='absolute -top-1 -right-1 px-1' aria-hidden='true'>
              {alerts.length}
            </Badge>
          </Button>
          <Button variant='outline' aria-label='Deployment (live)' onClick={() => open('Deployment')}>
            Live
            <StatusDot pulse className='size-2 bg-success' />
          </Button>
          <Button
            variant='outline'
            aria-label='Search'
            aria-keyshortcuts={search.ariaKeyShortcuts}
            onClick={() => open('Search')}
          >
            <RegistryIcon lucide='SearchIcon' aria-hidden='true' />
            Search
            <Kbd keys={search.kbdKeys} aria-hidden='true' />
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                aria-label='Command palette'
                aria-keyshortcuts={palette.ariaKeyShortcuts}
                onClick={() => open('Command palette')}
              >
                <RegistryIcon lucide='CommandIcon' aria-hidden='true' />
              </Button>
            </TooltipTrigger>
            <TooltipContent className='flex items-center gap-2'>
              Command palette
              <Kbd keys={palette.kbdKeys} />
            </TooltipContent>
          </Tooltip>
        </div>
        <CommandDialog open={panel === 'Command palette'} title='Command palette' onOpenChange={(show) => { if (!show) setPanel(''); }}>
          <Command>
            <CommandInput aria-label='Filter commands' placeholder='Filter commands' />
            <CommandList>
              <CommandEmpty>No matching results.</CommandEmpty>
              {Object.keys(activity).map(entry => <CommandItem key={entry} value={entry} onSelect={() => open(entry)}>{entry}</CommandItem>)}
            </CommandList>
          </Command>
        </CommandDialog>
        <Dialog
          open={Boolean(panel) && panel !== 'Command palette'}
          onOpenChange={(show) => {
            if (!show) setPanel('');
          }}
          title={panel || 'Activity'}
        >
          {panel === 'Search' ? (
            <Label className='grid gap-2'>
              Filter results
              <Input type='search' value={query} onChange={(event) => setQuery(event.target.value)} />
            </Label>
          ) : null}
          <ul className='mt-3 grid gap-2 text-sm'>
            {visible.map(entry => <li key={entry}>{entry}</li>)}
          </ul>
          {!visible.length && <EmptyState compact role='status' title='No matching results.' />}
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
