'use client';
import { useState } from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
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
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const icons = {
  filter: <RegistryIcon lucide='ListFilterIcon' aria-hidden='true' />,
  download: <RegistryIcon lucide='DownloadIcon' aria-hidden='true' />,
  chevronDown: <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' />,
  grid: <RegistryIcon lucide='LayoutGridIcon' aria-hidden='true' />,
  list: <RegistryIcon lucide='ListIcon' aria-hidden='true' />,
  fileSpreadsheet: (
    <RegistryIcon lucide='FileSpreadsheetIcon' aria-hidden='true' />
  ),
  fileJson: <RegistryIcon lucide='FileJsonIcon' aria-hidden='true' />,
  filePdf: <RegistryIcon lucide='FileTextIcon' aria-hidden='true' />
};
export function Pattern() {
  const [view, setView] = useState('grid');
  return (
    <ButtonGroup>
      <Button variant='outline'>
        {icons.filter}
        Filter
      </Button>
      <ButtonGroupSeparator />
      <Button variant='outline'>
        {icons.download}
        Export CSV
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='shrink-0'
            aria-label='More export options'
          >
            {icons.chevronDown}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-40'>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {icons.fileSpreadsheet}
              Export Excel
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.fileJson}
              Export JSON
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.filePdf}
              Export PDF
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant='outline'
        size='icon'
        aria-label='Grid view'
        className={cn(view === 'grid' ? 'bg-ui-muted' : '')}
        onClick={() => setView('grid')}
      >
        {icons.grid}
      </Button>
      <Button
        variant='outline'
        size='icon'
        aria-label='List view'
        className={cn(view === 'list' ? 'bg-ui-muted' : '')}
        onClick={() => setView('list')}
      >
        {icons.list}
      </Button>
    </ButtonGroup>
  );
}
