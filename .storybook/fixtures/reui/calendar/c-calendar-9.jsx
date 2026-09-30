// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
export function Pattern() {
  const [date, setDate] = useState(/* @__PURE__ */ new Date());
  const handleCalendarChange = (_value, _e) => {
    const _event = {
      target: {
        value: String(_value)
      }
    };
    _e(_event);
  };
  return (
    <Card className='p-0'>
      <CardContent className='p-0'>
        <Calendar
          captionLayout='dropdown-years'
          classNames={{
            nav: 'flex items-center w-full absolute top-0 inset-x-0 justify-between pointer-events-none [&>button]:pointer-events-auto'
          }}
          components={{
            DropdownNav: (props) => {
              return (
                <div className='flex w-full items-center justify-center gap-3 [&>span]:text-sm [&>span]:font-medium'>
                  {props.children}
                </div>
              );
            },
            YearsDropdown: (props) => {
              return (
                <Select
                  onValueChange={(value) => {
                    if (value == null || !props.onChange) {
                      return;
                    }
                    handleCalendarChange(value, props.onChange);
                  }}
                  value={String(props.value)}
                >
                  <SelectTrigger aria-label='Choose an option'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {props.options?.map((option) => (
                      <SelectItem
                        disabled={option.disabled}
                        key={option.value}
                        value={String(option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            }
          }}
          defaultMonth={/* @__PURE__ */ new Date()}
          mode='single'
          onSelect={setDate}
          selected={date}
          startMonth={new Date(1980, 6)}
        />
      </CardContent>
    </Card>
  );
}
