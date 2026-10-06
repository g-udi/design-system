'use client';
import { useState } from 'react';
import { addDays } from 'date-fns';
import { default as Button } from '@gaudi/design-system/core/Button';
import { CardRoot as Card, CardContent } from '@gaudi/design-system/core/Card';
import { Calendar } from '@gaudi/design-system/core/Calendar';
import {
  SelectRoot as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@gaudi/design-system/core/Select';
import {
  ToggleGroupRoot as ToggleGroup,
  ToggleGroupItem
} from '@gaudi/design-system/core/ToggleGroup';

// react-day-picker hands each dropdown an onChange that expects a change event.
function CaptionSelect({ label, value, options, onChange }) {
  return (
    <Select
      value={String(value)}
      onValueChange={(next) => next != null && onChange?.({ target: { value: String(next) } })}
    >
      <SelectTrigger size='sm' aria-label={label}>
        <SelectValue>{options?.find((option) => option.value === value)?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent align='start'>
        {options?.map((option) => (
          <SelectItem key={option.value} value={String(option.value)} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

const layouts = {
  centered: { label: 'Centered' },
  end: {
    label: 'Arrows at end',
    props: {
      classNames: {
        month_caption: 'ms-2.5 justify-start',
        nav: 'absolute inset-x-0 top-0 flex w-full items-center justify-end'
      }
    }
  },
  dropdowns: {
    label: 'Month and year',
    props: {
      captionLayout: 'dropdown',
      hideNavigation: true,
      components: {
        MonthsDropdown: (props) => <CaptionSelect label='Month' {...props} />,
        YearsDropdown: (props) => <CaptionSelect label='Year' {...props} />,
        DropdownNav: ({ children }) => (
          <div className='flex w-full items-center gap-2 [&>*]:flex-1'>{children}</div>
        )
      }
    }
  },
  year: {
    label: 'Year',
    props: {
      captionLayout: 'dropdown-years',
      classNames: {
        nav: 'pointer-events-none absolute inset-x-0 top-0 flex w-full items-center justify-between [&>button]:pointer-events-auto'
      },
      components: {
        YearsDropdown: (props) => <CaptionSelect label='Year' {...props} />,
        DropdownNav: ({ children }) => (
          <div className='flex items-center justify-center gap-2 text-sm font-medium'>
            {children}
          </div>
        )
      }
    }
  }
};

export function Pattern() {
  const today = new Date();
  const [layout, setLayout] = useState('dropdowns');
  const [date, setDate] = useState(addDays(today, -40));
  const [month, setMonth] = useState(date);
  return (
    <div className='mx-auto flex w-fit max-w-full flex-col gap-3'>
      <ToggleGroup
        className='max-w-full flex-wrap'
        type='single'
        variant='outline'
        size='sm'
        spacing={0}
        value={layout}
        onValueChange={(value) => value && setLayout(value)}
        aria-label='Caption layout'
      >
        {Object.entries(layouts).map(([value, item]) => (
          <ToggleGroupItem key={value} value={value}>
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Card className='w-fit gap-0 p-0'>
        <CardContent className='flex flex-col gap-2 p-0 pb-2'>
          <Calendar
            key={layout}
            mode='single'
            selected={date}
            onSelect={setDate}
            month={month}
            onMonthChange={setMonth}
            startMonth={new Date(1980, 0)}
            endMonth={new Date(today.getFullYear() + 5, 11)}
            {...layouts[layout].props}
          />
          <div className='flex gap-2 px-2'>
            <Button size='sm' variant='outline' onClick={() => setMonth(today)}>
              This month
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                setDate(today);
                setMonth(today);
              }}
            >
              Today
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
