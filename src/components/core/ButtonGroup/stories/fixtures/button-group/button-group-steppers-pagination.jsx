'use client';
import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  ButtonGroup,
  ButtonGroupText
} from '@gaudi/design-system/core/ButtonGroup';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { Pagination, PaginationLink, PaginationNext, PaginationPrevious, PaginationStatus } from '@gaudi/design-system/core/Pagination';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const stages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed won'];
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
function Row({ label, children }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <span className='text-xs text-text-muted'>{label}</span>
      <div className='flex flex-wrap items-center gap-2'>{children}</div>
    </div>
  );
}
export function Pattern() {
  const [volume, setVolume] = useState(50);
  const [muted, setMuted] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [stage, setStage] = useState(2);
  const [page, setPage] = useState(3);
  const changeVolume = (delta) => {
    const next = clamp(volume + delta, 0, 100);
    setVolume(next);
    setMuted(next === 0);
  };
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-3'>
      <Row label='Steppers'>
        <ButtonGroup aria-label='Volume'>
          <Button size='icon-sm' variant='outline' aria-label='Decrease Volume' onClick={() => changeVolume(-5)}><RegistryIcon aria-hidden='true' lucide='MinusIcon' /></Button>
          <Button size='sm' variant='outline' className='min-w-16 tabular-nums' onClick={() => setMuted(!muted)}>
            {muted ? 'Muted' : `${volume}%`}
          </Button>
          <Button size='icon-sm' variant='outline' aria-label='Increase Volume' onClick={() => changeVolume(5)}><RegistryIcon aria-hidden='true' lucide='PlusIcon' /></Button>
        </ButtonGroup>
        <ButtonGroup aria-label='Zoom'>
          <Button variant='outline' size='icon' aria-label='Zoom out' onClick={() => setZoom(clamp(zoom - 10, 10, 200))}><RegistryIcon aria-hidden='true' lucide='MinusIcon' /></Button>
          <ButtonGroupText className='w-16 justify-center border border-border text-sm tabular-nums'>{zoom}%</ButtonGroupText>
          <Button variant='outline' size='icon' aria-label='Zoom in' onClick={() => setZoom(clamp(zoom + 10, 10, 200))}><RegistryIcon aria-hidden='true' lucide='PlusIcon' /></Button>
        </ButtonGroup>
        <ButtonGroup aria-label='Pipeline stage'>
          <Button variant='outline' size='icon' aria-label='Previous stage' disabled={stage === 0} onClick={() => setStage(stage - 1)}><RegistryIcon aria-hidden='true' lucide='ChevronLeftIcon' /></Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='min-w-32 justify-between'>
                <span className='truncate'>{stages[stage]}</span>
                <RegistryIcon aria-hidden='true' lucide='ChevronsUpDownIcon' className='size-3.5 opacity-50' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-44'>
              <DropdownMenuLabel>Jump to stage</DropdownMenuLabel>
              <DropdownMenuRadioGroup aria-label='Jump to stage' value={stages[stage]} onValueChange={(value) => setStage(stages.indexOf(value))}>
                {stages.map((item) => (
                  <DropdownMenuRadioItem key={item} value={item}>{item}</DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant='outline' size='icon' aria-label='Next stage' disabled={stage === stages.length - 1} onClick={() => setStage(stage + 1)}><RegistryIcon aria-hidden='true' lucide='ChevronRightIcon' /></Button>
        </ButtonGroup>
      </Row>
      <Row label='Pagination'>
        <Pagination label='Numbered pagination' className='mx-0 w-fit'>
          <ButtonGroup aria-label='Pages'>
            <PaginationPrevious size='xs' disabled={page === 1} onClick={() => setPage(page - 1)} />
            {[1, 2, 3, 4, 5].map((number) => (
              <PaginationLink key={number} isActive={number === page} size='icon-xs' variant={number === page ? 'default' : 'outline'} className='text-xs tabular-nums' onClick={() => setPage(number)}>
                {number}
              </PaginationLink>
            ))}
            <PaginationNext size='xs' disabled={page === 5} onClick={() => setPage(page + 1)} />
          </ButtonGroup>
        </Pagination>
        <Pagination label='Compact pagination' className='mx-0 w-fit'>
          <ButtonGroup aria-label='Page controls'>
            <PaginationPrevious iconOnly label='Previous page' size='icon-sm' disabled={page === 1} onClick={() => setPage(page - 1)} />
            <PaginationStatus currentPage={page} totalPages={5} onPageChange={setPage} size='sm' />
            <PaginationNext iconOnly label='Next page' size='icon-sm' disabled={page === 5} onClick={() => setPage(page + 1)} />
          </ButtonGroup>
        </Pagination>
      </Row>
    </div>
  );
}
