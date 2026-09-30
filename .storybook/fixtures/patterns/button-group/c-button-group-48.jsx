'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupSeparator
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const Icon = ({ name, className }) => <RegistryIcon lucide={name} aria-hidden='true' className={className} />;
const views = [['Grid view', 'LayoutGridIcon', 'grid'], ['List view', 'ListIcon', 'list']];
export function Pattern() {
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('Newest');
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-wrap items-center gap-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon' aria-label={`Sort: ${sort}`}><Icon name='ArrowUpDownIcon' /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' className='min-w-40'>
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          {['Newest', 'Oldest', 'Recently updated'].map((item) => (
            <DropdownMenuItem key={item} onClick={() => setSort(item)}>
              {item}
              {item === sort ? <Icon name='CheckIcon' className='ml-auto size-3.5 text-accent' /> : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <ButtonGroup aria-label='Filter and export'>
        <Button variant='outline'><Icon name='ListFilterIcon' />Filter</Button>
        <ButtonGroupSeparator />
        <Button variant='outline'><Icon name='DownloadIcon' />Export CSV</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon' aria-label='More export options'><Icon name='ChevronDownIcon' /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-40'>
            <DropdownMenuItem><Icon name='FileSpreadsheetIcon' />Export Excel</DropdownMenuItem>
            <DropdownMenuItem><Icon name='FileJsonIcon' />Export JSON</DropdownMenuItem>
            <DropdownMenuItem><Icon name='FileTextIcon' />Export PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <ButtonGroup aria-label='View'>
        {views.map(([label, icon, id]) => (
          <Button
            key={id}
            variant='outline'
            size='icon'
            aria-label={label}
            aria-pressed={view === id}
            className={cn(view === id && 'bg-surface-muted')}
            onClick={() => setView(id)}
          >
            <Icon name={icon} />
          </Button>
        ))}
      </ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Add new
            <Icon name='ChevronDownIcon' className='opacity-60' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='min-w-40'>
          <DropdownMenuGroup>
            <DropdownMenuItem><Icon name='PlusIcon' />Project</DropdownMenuItem>
            <DropdownMenuItem><Icon name='PlusIcon' />Domain</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem><Icon name='PlusIcon' />Team</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
