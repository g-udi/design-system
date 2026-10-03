'use client';
import { useState } from 'react';
import { useCopyToClipboard } from '../../../../src/hooks/interaction/use-copy-to-clipboard.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Frame,
  FrameHeader,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../../../src/components/core/Accordion/parts/collapsible.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const initialKeys = [
  { id: '1', name: 'Production', key: 'AUDO230454*242SDIFPPL' },
  { id: '2', name: 'Development', key: 'DUILO30454*242SDIFUIP' },
  { id: '3', name: 'Staging', key: 'IPPODAS230454*242SDI' }
];
const profile = [
  { icon: 'MessageSquareIcon', label: 'Last activity', value: '2 hours ago' },
  { icon: 'ClockIcon', label: 'Online since', value: 'Today, 9:00 AM' },
  { icon: 'MapPinIcon', label: 'Location', value: 'Toronto, Canada' }
];
const Chevron = () => (
  <RegistryIcon
    lucide='ChevronRightIcon'
    aria-hidden='true'
    className='ds-part-rtl-flip size-4 shrink-0 text-text-muted transition-transform in-data-[state=open]:rotate-90'
  />
);
// The whole header is the trigger when the section has no other controls.
function Section({ title, defaultOpen, children }) {
  return (
    <Frame stacked dense spacing='sm' className='w-full'>
      <Collapsible defaultOpen={defaultOpen}>
        <CollapsibleTrigger className='flex w-full'>
          <FrameHeader className='flex grow flex-row items-center justify-between gap-2'>
            {title}
            <Chevron />
          </FrameHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <FramePanel>{children}</FramePanel>
        </CollapsibleContent>
      </Collapsible>
    </Frame>
  );
}
function ApiKeyItem({ item, onDelete }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  return (
    <div className='flex items-center gap-2'>
      <RegistryIcon lucide='LockIcon' aria-hidden='true' className='size-3.5 shrink-0 text-success' />
      <span className='w-20 shrink-0 truncate text-xs'>{item.name}</span>
      <code className='min-w-0 flex-1 truncate rounded-md bg-surface-muted px-2 py-1 text-xs'>{item.key}</code>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label={`${item.name} key actions`} variant='ghost' size='icon-xs'>
            <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='min-w-32'>
          <DropdownMenuItem onClick={() => copyToClipboard(item.key)}>
            <RegistryIcon lucide={isCopied ? 'CheckIcon' : 'CopyIcon'} aria-hidden='true' />
            <span>{isCopied ? 'Copied' : 'Copy key'}</span>
          </DropdownMenuItem>
          <DropdownMenuItem variant='destructive' onClick={() => onDelete(item.id)}>
            <RegistryIcon lucide='TrashIcon' aria-hidden='true' />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
export function Pattern() {
  const [keys, setKeys] = useState(initialKeys);
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col gap-2'>
      <Section title={<span className='text-sm font-medium'>Deployment successful</span>} defaultOpen>
        <p className='text-xs leading-relaxed text-text-muted'>
          Updated the authentication logic and fixed a bug in the login flow. Session handling is faster.
        </p>
      </Section>
      {/* With an action in the header, only the title is the trigger. */}
      <Frame stacked dense spacing='sm' className='w-full'>
        <Collapsible defaultOpen>
          <FrameHeader className='flex flex-row items-center gap-1.5 py-1!'>
            <CollapsibleTrigger className='flex flex-1 items-center gap-1.5 text-start text-sm font-medium'>
              <Chevron />
              API keys
            </CollapsibleTrigger>
            <Button aria-label='Add key' variant='ghost' size='icon-sm'>
              <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
            </Button>
          </FrameHeader>
          <CollapsibleContent>
            <FramePanel>
              <div className='flex flex-col gap-2'>
                {keys.map((item) => (
                  <ApiKeyItem key={item.id} item={item} onDelete={(id) => setKeys((current) => current.filter((key) => key.id !== id))} />
                ))}
                {keys.length ? null : <p className='text-xs text-text-muted'>No keys left.</p>}
              </div>
            </FramePanel>
          </CollapsibleContent>
        </Collapsible>
      </Frame>
      <Section
        title={
          <span className='flex items-center gap-2'>
            <Avatar className='size-5'>
              <AvatarImage src='/avatars/men/32.jpg' alt='' />
              <AvatarFallback>AJ</AvatarFallback>
            </Avatar>
            <span className='text-sm font-medium text-text'>@alexjohnson</span>
          </span>
        }
      >
        <dl className='grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-2 text-xs'>
          {profile.map((row) => (
            <div key={row.label} className='contents'>
              <dt className='flex items-center gap-2 text-text-muted'>
                <RegistryIcon lucide={row.icon} aria-hidden='true' className='size-3.5' />
                {row.label}
              </dt>
              <dd className='font-medium text-text'>{row.value}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  );
}
