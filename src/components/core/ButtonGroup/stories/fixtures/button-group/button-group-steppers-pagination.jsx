'use client';
import { Toggle } from '@gaudi/design-system/core/ToggleGroup';
import { NumberField, NumberFieldGroup, NumberFieldDecrement, NumberFieldInput, NumberFieldIncrement } from '@gaudi/design-system/core/NumberField';
import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  ButtonGroup
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
function Row({ label, children }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <span className='text-xs text-text-muted'>{label}</span>
      <div className='flex flex-wrap items-center gap-2'>{children}</div>
    </div>
  );
}
export function Pattern() {
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [stage, setStage] = useState(2);
  const [page, setPage] = useState(3);
  const changeVolume = (value) => {
    if (value == null) return;
    setVolume(value);
    setMuted(value === 0);
  };
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-3'>
      <Row label='Steppers'>
        <div className='flex items-center gap-1'>
          <NumberField value={volume} min={0} max={1} step={0.05} onValueChange={changeVolume} format={{ style: 'percent' }} size='sm' className='w-32'>
            <NumberFieldGroup>
              <NumberFieldDecrement aria-label='Decrease Volume' />
              <NumberFieldInput aria-label='Volume' />
              <NumberFieldIncrement aria-label='Increase Volume' />
            </NumberFieldGroup>
          </NumberField>
          <Toggle variant='outline' size='sm' aria-label='Mute volume' pressed={muted} onPressedChange={setMuted}>
            <RegistryIcon aria-hidden='true' lucide={muted ? 'VolumeX' : 'Volume2'} />
          </Toggle>
        </div>
        <NumberField value={zoom} min={0.1} max={2} step={0.1} onValueChange={(value) => value != null && setZoom(value)} format={{ style: 'percent' }} size='sm' className='w-32'>
          <NumberFieldGroup>
            <NumberFieldDecrement aria-label='Zoom out' />
            <NumberFieldInput aria-label='Zoom' />
            <NumberFieldIncrement aria-label='Zoom in' />
          </NumberFieldGroup>
        </NumberField>
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
