// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { useCopyToClipboard } from '../../../../src/hooks/use-copy-to-clipboard.js';
import {
  Frame,
  FrameHeader,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
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
export function Pattern() {
  const [keys, setKeys] = useState(initialKeys);
  return (
    <div className='h-54 w-full max-w-xs'>
      <Frame stacked dense spacing='sm'>
        <Collapsible defaultOpen>
          <FrameHeader className='flex grow flex-row items-center justify-between gap-1.5 py-1!'>
            <RegistryIcon
              lucide='ChevronRightIcon'
              aria-hidden='true'
              className='text-ui-muted-foreground size-4 transition-transform in-data-[state=open]:rotate-90'
            />
            <CollapsibleTrigger className='text-sm font-medium flex-1 text-start'>
              API Keys
            </CollapsibleTrigger>
            <Button
              aria-label='Add'
              variant='ghost'
              size='icon-sm'
              className='hover:border-ui-border ml-auto'
            >
              <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
            </Button>
          </FrameHeader>
          <CollapsibleContent>
            <FramePanel>
              <div className='flex flex-col gap-2.5'>
                {keys.map((item) => (
                  <ApiKeyItem
                    key={item.id}
                    item={item}
                    onDelete={(id) =>
                      setKeys((k) => k.filter((i) => i.id !== id))
                    }
                  />
                ))}
              </div>
            </FramePanel>
          </CollapsibleContent>
        </Collapsible>
      </Frame>
    </div>
  );
}
function ApiKeyItem({ item, onDelete }) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  return (
    <div className='flex items-center justify-between gap-3.5'>
      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-1.5'>
          <div className='bg-ui-muted border-ui-border/60 flex size-5.5 shrink-0 items-center justify-center rounded-sm border-2'>
            <RegistryIcon
              lucide='LockIcon'
              aria-hidden='true'
              className='size-3.25 text-emerald-600'
            />
          </div>
          <div className='w-10 truncate text-xs'>{item.name}</div>
        </div>
        <div className='bg-ui-muted w-40 truncate rounded-md px-2 py-1 text-xs'>
          {item.key}
        </div>
      </div>
      <div className='flex shrink-0 items-center'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label='More actions' variant='ghost' size='icon-xs'>
              <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='min-w-32'>
            <DropdownMenuItem onClick={() => copyToClipboard(item.key)}>
              {isCopied ? (
                <RegistryIcon
                  lucide='CheckIcon'
                  aria-hidden='true'
                  className='text-green-500'
                />
              ) : (
                <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
              )}
              <span>{isCopied ? 'Copied' : 'Copy key'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant='destructive'
              onClick={() => onDelete(item.id)}
            >
              <RegistryIcon lucide='TrashIcon' aria-hidden='true' />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
