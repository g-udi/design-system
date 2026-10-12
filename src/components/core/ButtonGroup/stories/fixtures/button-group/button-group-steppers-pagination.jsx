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
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const Icon = ({ name, className }) => <RegistryIcon lucide={name} aria-hidden='true' className={className} />;
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
          <Button size='icon-sm' variant='outline' aria-label='Decrease Volume' onClick={() => changeVolume(-5)}><Icon name='MinusIcon' /></Button>
          <Button size='sm' variant='outline' className='min-w-16 tabular-nums' onClick={() => setMuted(!muted)}>
            {muted ? 'Muted' : `${volume}%`}
          </Button>
          <Button size='icon-sm' variant='outline' aria-label='Increase Volume' onClick={() => changeVolume(5)}><Icon name='PlusIcon' /></Button>
        </ButtonGroup>
        <ButtonGroup aria-label='Zoom'>
          <Button variant='outline' size='icon' aria-label='Zoom out' onClick={() => setZoom(clamp(zoom - 10, 10, 200))}><Icon name='MinusIcon' /></Button>
          <ButtonGroupText className='w-16 justify-center border border-border text-sm tabular-nums'>{zoom}%</ButtonGroupText>
          <Button variant='outline' size='icon' aria-label='Zoom in' onClick={() => setZoom(clamp(zoom + 10, 10, 200))}><Icon name='PlusIcon' /></Button>
        </ButtonGroup>
        <ButtonGroup aria-label='Pipeline stage'>
          <Button variant='outline' size='icon' aria-label='Previous stage' disabled={stage === 0} onClick={() => setStage(stage - 1)}><Icon name='ChevronLeftIcon' /></Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='min-w-32 justify-between'>
                <span className='truncate'>{stages[stage]}</span>
                <Icon name='ChevronsUpDownIcon' className='size-3.5 opacity-50' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-44'>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Jump to stage</DropdownMenuLabel>
                {stages.map((item, index) => (
                  <DropdownMenuItem key={item} onClick={() => setStage(index)}>
                    {item}
                    {index === stage ? <Icon name='CheckIcon' className='ml-auto size-3.5 text-accent' /> : null}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant='outline' size='icon' aria-label='Next stage' disabled={stage === stages.length - 1} onClick={() => setStage(stage + 1)}><Icon name='ChevronRightIcon' /></Button>
        </ButtonGroup>
      </Row>
      <Row label='Pagination'>
        <ButtonGroup aria-label='Pagination'>
          <Button variant='outline' size='xs' className='max-sm:w-6 max-sm:p-0' disabled={page === 1} onClick={() => setPage(page - 1)}><Icon name='ArrowLeftIcon' /><span className='max-sm:sr-only'>Previous</span></Button>
          {[1, 2, 3, 4, 5].map((n) => (
            <Button
              key={n}
              size='icon-xs'
              variant={n === page ? 'default' : 'outline'}
              aria-current={n === page ? 'page' : undefined}
              className='text-xs tabular-nums'
              onClick={() => setPage(n)}
            >
              {n}
            </Button>
          ))}
          <Button variant='outline' size='xs' className='max-sm:w-6 max-sm:p-0' disabled={page === 5} onClick={() => setPage(page + 1)}><span className='max-sm:sr-only'>Next</span><Icon name='ArrowRightIcon' /></Button>
        </ButtonGroup>
        <ButtonGroup aria-label='Compact pagination'>
          <Button variant='outline' size='icon-sm' aria-label='Previous page' disabled={page === 1} onClick={() => setPage(page - 1)}><Icon name='ChevronLeftIcon' /></Button>
          <ButtonGroupText className='border border-border px-2.5 text-xs text-text-muted tabular-nums'>Page {page} of 5</ButtonGroupText>
          <Button variant='outline' size='icon-sm' aria-label='Next page' disabled={page === 5} onClick={() => setPage(page + 1)}><Icon name='ChevronRightIcon' /></Button>
        </ButtonGroup>
      </Row>
    </div>
  );
}
