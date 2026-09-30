// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import * as React from 'react';
import { cn } from '../../../../src/utilities/cn/index.js';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue
} from '../../../../src/components/core/Select/parts/combobox.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const statusOptions = [
  { value: 'backlog', label: 'Backlog', tone: 'backlog' },
  { value: 'planned', label: 'Planned', tone: 'planned' },
  { value: 'in-progress', label: 'In Progress', tone: 'inProgress' },
  { value: 'paused', label: 'Paused', tone: 'paused' },
  { value: 'completed', label: 'Completed', tone: 'completed' },
  { value: 'cancelled', label: 'Cancelled', tone: 'cancelled' }
];
function StatusGlyph({ tone, className }) {
  switch (tone) {
    case 'backlog':
      return (
        <RegistryIcon
          lucide='CircleDotIcon'
          className={cn(
            'text-ui-muted-foreground! **:text-ui-muted-foreground! size-4 shrink-0',
            className
          )}
        />
      );
    case 'planned':
      return (
        <RegistryIcon
          lucide='CircleIcon'
          className={cn(
            'text-ui-foreground! [&_*]:text-ui-foreground! size-4 shrink-0',
            className
          )}
        />
      );
    case 'inProgress':
      return (
        <RegistryIcon
          lucide='CircleDotIcon'
          className={cn(
            'size-4 shrink-0 text-sky-500! [&_*]:text-sky-500!',
            className
          )}
        />
      );
    case 'paused':
      return (
        <RegistryIcon
          lucide='PauseCircleIcon'
          className={cn(
            'size-4 shrink-0 text-amber-500! [&_*]:text-amber-500!',
            className
          )}
        />
      );
    case 'completed':
      return (
        <RegistryIcon
          lucide='CircleCheckIcon'
          className={cn(
            'size-4 shrink-0 text-emerald-500! [&_*]:text-emerald-500!',
            className
          )}
        />
      );
    case 'cancelled':
      return (
        <RegistryIcon
          lucide='CircleXIcon'
          className={cn(
            'text-ui-muted-foreground! [&_*]:text-ui-muted-foreground! size-4 shrink-0',
            className
          )}
        />
      );
  }
}
function StatusLabel({ status, className }) {
  return (
    <span className={cn('flex min-w-0 items-center gap-2', className)}>
      <StatusGlyph tone={status.tone} />
      <span className='truncate'>{status.label}</span>
    </span>
  );
}
export function Pattern() {
  const [status, setStatus] = React.useState(statusOptions[1]);
  return (
    <Field className='max-w-xs'>
      <Combobox
        items={statusOptions}
        value={status}
        onValueChange={setStatus}
        itemToStringValue={(item) => item.label}
        autoHighlight
      >
        <ComboboxTrigger
          render={
            <Button
              type='button'
              variant='outline'
              className='w-full justify-between font-normal'
            />
          }
        >
          <ComboboxValue placeholder='Set status'>
            {(selectedStatus) =>
              selectedStatus ? (
                <StatusLabel status={selectedStatus} />
              ) : (
                <span className='text-ui-muted-foreground'>Set status</span>
              )
            }
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className='max-w-(--anchor-width) min-w-(--anchor-width)'>
          <ComboboxInput
            showTrigger={false}
            placeholder='Change status'
            className='mb-1'
          />
          <ComboboxEmpty>No statuses found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                <StatusLabel status={item} />
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
