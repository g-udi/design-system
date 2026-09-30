'use client';
import { useState } from 'react';
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from '../../../../src/components/core/Timeline/parts/timeline-extended.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { cn } from '../../../../src/utilities/cn/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const steps = [
  { id: 1, date: 'Mar 15', title: 'Order placed', icon: 'ShoppingBagIcon', description: 'Your order has been received and is being processed.' },
  { id: 2, date: 'Mar 16', title: 'Payment confirmed', icon: 'CreditCardIcon', description: 'Transaction successful. Preparing for shipment.' },
  { id: 3, date: 'Mar 18', title: 'Shipped', icon: 'TruckIcon', description: 'Your package is on its way with tracking number 1Z 999 AA1.' },
  { id: 4, date: 'Mar 20', title: 'Delivered', icon: 'PackageCheckIcon', description: 'Expected at the front desk before 6 pm.' }
];

const indicators = [
  { value: 'dot', label: 'Dot' },
  { value: 'check', label: 'Check' },
  { value: 'icon', label: 'Icon' }
];

// Larger indicators sit a little further out, so the rail and the content shift with them.
const large = {
  item: 'group-data-[orientation=vertical]/timeline:ms-10',
  separator:
    'group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5',
  indicator:
    'flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-completed/timeline-item:bg-ui-primary group-data-completed/timeline-item:text-ui-primary-foreground group-data-[orientation=vertical]/timeline:-left-7'
};

export function Pattern() {
  const [indicator, setIndicator] = useState('check');
  const [leadingDates, setLeadingDates] = useState(false);
  const [compact, setCompact] = useState(false);
  const isLarge = indicator !== 'dot';
  return (
    <div className='mx-auto flex w-full max-w-md flex-col gap-3'>
      <div role='group' aria-label='Timeline options' className='flex flex-wrap items-center gap-x-4 gap-y-2'>
        <ToggleGroup
          aria-label='Indicator'
          type='single'
          variant='outline'
          size='sm'
          spacing={0}
          value={indicator}
          onValueChange={(value) => value && setIndicator(value)}
        >
          {indicators.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Label className='gap-2 text-sm font-normal'>
          <Switch size='sm' checked={leadingDates} onCheckedChange={setLeadingDates} />
          Leading dates
        </Label>
        <Label className='gap-2 text-sm font-normal'>
          <Switch size='sm' checked={compact} onCheckedChange={setCompact} />
          Compact
        </Label>
      </div>
      <Timeline defaultValue={3}>
        {steps.map((step) => (
          <TimelineItem
            key={step.id}
            step={step.id}
            className={cn(
              isLarge && large.item,
              leadingDates && 'sm:group-data-[orientation=vertical]/timeline:ms-28',
              compact && 'group-data-[orientation=vertical]/timeline:not-last:pb-2'
            )}
          >
            <TimelineHeader>
              <TimelineSeparator className={cn(isLarge && large.separator)} />
              <TimelineDate
                className={cn(
                  leadingDates &&
                    'sm:group-data-[orientation=vertical]/timeline:absolute sm:group-data-[orientation=vertical]/timeline:-left-28 sm:group-data-[orientation=vertical]/timeline:w-14 sm:group-data-[orientation=vertical]/timeline:text-right',
                  leadingDates && isLarge && 'sm:group-data-[orientation=vertical]/timeline:top-1'
                )}
              >
                {step.date}
              </TimelineDate>
              <TimelineTitle>{step.title}</TimelineTitle>
              <TimelineIndicator className={cn(isLarge && large.indicator, indicator === 'icon' && 'bg-ui-primary/10')}>
                {indicator === 'check' && (
                  <RegistryIcon lucide='CheckIcon' className='size-3.5 group-not-data-completed/timeline-item:hidden' />
                )}
                {indicator === 'icon' && <RegistryIcon lucide={step.icon} className='size-3.5' />}
              </TimelineIndicator>
            </TimelineHeader>
            {!compact && <TimelineContent>{step.description}</TimelineContent>}
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
