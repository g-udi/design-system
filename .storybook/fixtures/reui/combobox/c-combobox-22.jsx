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
const priorityOptions = [
  { value: 'none', label: 'No Priority', tone: 'none' },
  { value: 'low', label: 'Low', tone: 'low' },
  { value: 'medium', label: 'Medium', tone: 'medium' },
  { value: 'high', label: 'High', tone: 'high' },
  { value: 'urgent', label: 'Urgent', tone: 'urgent' }
];
function LowPriorityIcon({ className }) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 16 16'
      fill='none'
      className={cn('size-4 shrink-0', className)}
    >
      <rect x='3' y='9' width='2.5' height='4' rx='1' fill='currentColor' />
      <rect
        x='7'
        y='6'
        width='2.5'
        height='7'
        rx='1'
        fill='currentColor'
        opacity='0.28'
      />
      <rect
        x='11'
        y='3'
        width='2.5'
        height='10'
        rx='1'
        fill='currentColor'
        opacity='0.28'
      />
    </svg>
  );
}
function MediumPriorityIcon({ className }) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 16 16'
      fill='none'
      className={cn('size-4 shrink-0', className)}
    >
      <rect x='3' y='9' width='2.5' height='4' rx='1' fill='currentColor' />
      <rect x='7' y='6' width='2.5' height='7' rx='1' fill='currentColor' />
      <rect
        x='11'
        y='3'
        width='2.5'
        height='10'
        rx='1'
        fill='currentColor'
        opacity='0.28'
      />
    </svg>
  );
}
function HighPriorityIcon({ className }) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 16 16'
      fill='none'
      className={cn('size-4 shrink-0', className)}
    >
      <rect x='3' y='9' width='2.5' height='4' rx='1' fill='currentColor' />
      <rect x='7' y='6' width='2.5' height='7' rx='1' fill='currentColor' />
      <rect x='11' y='3' width='2.5' height='10' rx='1' fill='currentColor' />
    </svg>
  );
}
function PriorityGlyph({ tone, className }) {
  switch (tone) {
    case 'none':
      return (
        <RegistryIcon
          lucide='MoreHorizontalIcon'
          className={cn(
            'text-ui-muted-foreground! [&_*]:text-ui-muted-foreground! size-4 shrink-0',
            className
          )}
        />
      );
    case 'low':
      return (
        <LowPriorityIcon
          className={cn(
            'text-ui-foreground! [&_*]:text-ui-foreground!',
            className
          )}
        />
      );
    case 'medium':
      return (
        <MediumPriorityIcon
          className={cn(
            'text-ui-foreground! [&_*]:text-ui-foreground!',
            className
          )}
        />
      );
    case 'high':
      return (
        <HighPriorityIcon
          className={cn(
            'text-ui-foreground! [&_*]:text-ui-foreground!',
            className
          )}
        />
      );
    case 'urgent':
      return (
        <RegistryIcon
          lucide='TriangleAlertIcon'
          className={cn(
            'size-4 shrink-0 text-yellow-500! [&_*]:text-yellow-500!',
            className
          )}
        />
      );
  }
}
function PriorityLabel({ priority, className }) {
  const labelClassName =
    priority.tone === 'urgent' ? 'text-yellow-500!' : 'text-ui-foreground!';
  return (
    <span
      className={cn(
        'text-ui-foreground! flex min-w-0 items-center gap-2',
        priority.tone === 'urgent' && 'text-yellow-500!',
        className
      )}
    >
      <PriorityGlyph tone={priority.tone} />
      <span className={cn('truncate', labelClassName)}>{priority.label}</span>
    </span>
  );
}
export function Pattern() {
  const [priority, setPriority] = React.useState(priorityOptions[0]);
  return (
    <Field className='max-w-xs'>
      <Combobox
        items={priorityOptions}
        value={priority}
        onValueChange={setPriority}
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
          <ComboboxValue placeholder='Set priority'>
            {(selectedPriority) =>
              selectedPriority ? (
                <PriorityLabel priority={selectedPriority} />
              ) : (
                <span className='text-ui-muted-foreground'>Set priority</span>
              )
            }
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className='max-w-(--anchor-width) min-w-(--anchor-width)'>
          <ComboboxInput
            showTrigger={false}
            placeholder='Change priority'
            className='mb-1'
          />
          <ComboboxEmpty>No priorities found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                <PriorityLabel priority={item} />
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}
