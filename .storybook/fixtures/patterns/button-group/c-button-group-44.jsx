'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
const icons = {
  prev: <RegistryIcon lucide='ChevronLeftIcon' aria-hidden='true' />,
  next: <RegistryIcon lucide='ChevronRightIcon' aria-hidden='true' />,
  chevronsUpDown: (
    <RegistryIcon
      lucide='ChevronsUpDownIcon'
      aria-hidden='true'
      className='size-3.5 shrink-0 opacity-50'
    />
  ),
  check: (
    <RegistryIcon
      lucide='CheckIcon'
      aria-hidden='true'
      className='text-ui-primary ml-auto size-3.5'
    />
  )
};
export function Pattern() {
  const [stageIndex, setStageIndex] = useState(2);
  return (
    <ButtonGroup>
      <Button
        variant='outline'
        size='icon'
        aria-label='Previous stage'
        disabled={stageIndex === 0}
        onClick={() => setStageIndex((i) => i - 1)}
      >
        {icons.prev}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='min-w-36 justify-between'>
            <span className='truncate'>{stages[stageIndex]}</span>
            {icons.chevronsUpDown}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-44'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Jump to stage</DropdownMenuLabel>
            {stages.map((stage, i) => (
              <DropdownMenuItem key={stage} onClick={() => setStageIndex(i)}>
                {stage}
                {i === stageIndex ? icons.check : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant='outline'
        size='icon'
        aria-label='Next stage'
        disabled={stageIndex === stages.length - 1}
        onClick={() => setStageIndex((i) => i + 1)}
      >
        {icons.next}
      </Button>
    </ButtonGroup>
  );
}
