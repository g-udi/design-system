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
          captionLayout='dropdown'
          classNames={{
            month_caption: 'mx-0'
          }}
          components={{
            Dropdown: (props) => {
              return (
                <Select
                  onValueChange={(value) => {
                    if (props.onChange && value !== null) {
                      handleCalendarChange(value, props.onChange);
                    }
                  }}
                  value={String(props.value)}
                >
                  <SelectTrigger
                    aria-label='Choose an option'
                    className='first:grow'
                  >
                    <SelectValue>
                      {
                        props.options?.find(
                          (option) => option.value === props.value
                        )?.label
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align='start'>
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
            },
            DropdownNav: (props) => {
              return (
                <div className='flex w-full items-center gap-2'>
                  {props.children}
                </div>
              );
            }
          }}
          defaultMonth={/* @__PURE__ */ new Date()}
          hideNavigation
          mode='single'
          onSelect={setDate}
          selected={date}
          startMonth={new Date(1980, 6)}
        />
      </CardContent>
    </Card>
  );
}
