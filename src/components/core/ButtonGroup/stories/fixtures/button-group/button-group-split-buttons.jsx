'use client';
import { useState } from 'react';
import { FieldInput } from '@gaudi/design-system/core/Field';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText
} from '@gaudi/design-system/core/ButtonGroup';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
function Menu({ label, items, heading, onSelect, size = 'icon', variant, icon = 'ChevronDownIcon' }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} aria-label={label}><RegistryIcon aria-hidden='true' lucide={icon} /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-52'>
        <DropdownMenuGroup>
          {heading ? <DropdownMenuLabel>{heading}</DropdownMenuLabel> : null}
          {items.filter(([, , danger]) => !danger).map(([item, itemIcon]) => (
            <DropdownMenuItem key={item} onSelect={() => onSelect(item)}>{itemIcon ? <RegistryIcon aria-hidden='true' lucide={itemIcon} /> : null}{item}</DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {items.filter(([, , danger]) => danger).map(([item, itemIcon]) => (
          <DropdownMenuGroup key={item}>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive' onSelect={() => onSelect(item)}><RegistryIcon aria-hidden='true' lucide={itemIcon} />{item}</DropdownMenuItem>
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
function Row({ label, children }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <span className='text-xs text-text-muted'>{label}</span>
      <div className='flex flex-wrap items-center gap-2'>{children}</div>
    </div>
  );
}
export function Pattern() {
  const [draft, setDraft] = useState('Release brief');
  const [saved, setSaved] = useState('Release brief');
  const [review, setReview] = useState('Draft');
  const [files, setFiles] = useState(['Release brief']);
  const [transfer, setTransfer] = useState('Ready');
  const [day, setDay] = useState('Friday');
  const save = (status) => {
    if (!draft.trim()) return;
    setSaved(draft.trim());
    setReview(status);
  };
  const create = (type) => setFiles((current) => [...current, type.slice(4) + ' ' + (current.length + 1)]);
  const schedule = [`Amount: USD 12,480`, `Status: ${transfer}`, `Day: ${day}`].join('\n');
  return (
    <div className='mx-auto flex w-full max-w-lg flex-col gap-3'>
      <Row label='Solid'>
        <FieldInput aria-label='Draft title' value={draft} onChange={(event) => setDraft(event.target.value)} />
        <ButtonGroup aria-label='Save' className='**:data-[slot=button]:border-x-0'>
          <Button disabled={!draft.trim()} onClick={() => save('Draft')}>Save</Button>
          <ButtonGroupSeparator className='bg-ui-primary-foreground/35' />
          <Menu label='More save options' items={[['Save for review'], ['Revert to saved title']]} onSelect={(action) => action === 'Save for review' ? save('Awaiting review') : setDraft(saved)} />
        </ButtonGroup>
        <ButtonGroup aria-label='Review' className='**:data-[slot=button]:border-x-0'>
          <Button onClick={() => setReview('Approved')}><RegistryIcon aria-hidden='true' lucide='CheckIcon' />Approve</Button>
          <ButtonGroupSeparator className='bg-ui-primary-foreground/35' />
          <Menu label='More review options' items={[['Request changes', 'MessageSquareIcon'], ['Reject', 'XIcon', true]]} onSelect={(action) => setReview(action === 'Reject' ? 'Rejected' : 'Changes requested')} />
        </ButtonGroup>
        <p className='w-full text-sm' aria-live='polite'>{saved} · {review}</p>
      </Row>
      <Row label='Outline'>
        <ButtonGroup aria-label='Create'>
          <Button variant='outline' size='sm' onClick={() => create('New document')}><RegistryIcon aria-hidden='true' lucide='PlusIcon' />New</Button>
          <Menu variant='outline' size='icon-sm' icon='MoreHorizontalIcon' label='More create options' heading='Create' items={[['New document', 'FileTextIcon'], ['New folder', 'FolderIcon'], ['New project', 'PlusIcon']]} onSelect={create} />
        </ButtonGroup>
        <ul className='w-full text-sm' aria-label='Workspace entries'>{files.map((file) => <li key={file}>{file}</li>)}</ul>
      </Row>
      <Row label='With a value'>
        <ButtonGroup aria-label='Contributor fees'>
          <ButtonGroupText className='gap-1.5 rounded-md border border-border bg-surface-muted px-2.5 text-xs text-text-muted'>
            <RegistryIcon aria-hidden='true' lucide='CreditCardIcon' className='size-3.5' />
            <span className='font-medium text-text tabular-nums'>USD 12,480</span>
          </ButtonGroupText>
          <Button variant='outline' size='sm' onClick={() => setTransfer(transfer === 'On hold' ? 'Ready' : 'On hold')}>{transfer === 'On hold' ? 'Release hold' : 'Hold'}</Button>
        </ButtonGroup>
        <ButtonGroup aria-label='Transfer plan' className='**:data-[slot=button]:border-x-0'>
          <Button asChild size='sm'><a href={'data:text/plain;charset=utf-8,' + encodeURIComponent(schedule)} download='transfer-plan.txt'><RegistryIcon aria-hidden='true' lucide='DownloadIcon' />Export plan</a></Button>
          <ButtonGroupSeparator className='bg-ui-primary-foreground/35' />
          <Menu size='icon-sm' label='Choose planned day' items={[['Wednesday'], ['Thursday'], ['Friday']]} onSelect={setDay} />
        </ButtonGroup>
        <p className='w-full text-sm' aria-live='polite'>{day} · {transfer}</p>
      </Row>
    </div>
  );
}
