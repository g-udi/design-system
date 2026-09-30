'use client';
import { useState } from 'react';
import { enUS, zhCN } from 'react-day-picker/locale';
import { Calendar } from '../../../../src/components/core/Calendar/parts/calendar.jsx';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
const localizedStrings = {
  en: {
    title: 'Schedule a meeting',
    description: 'Choose your preferred dates'
  },
  zh: {
    title: '\u5B89\u6392\u4F1A\u8BAE',
    description: '\u9009\u62E9\u60A8\u504F\u597D\u7684\u65E5\u671F'
  }
};
export function Pattern() {
  const [locale, setLocale] = useState('en');
  const [dateRange, setDateRange] = useState({
    from: new Date(2026, 1, 9),
    to: new Date(2026, 1, 17)
  });
  return (
    <Card>
      <CardHeader className='flex items-center justify-between'>
        <CardTitle>{localizedStrings[locale].title}</CardTitle>
        <CardAction>
          <Select value={locale} onValueChange={(value) => setLocale(value)}>
            <SelectTrigger className='w-[60px]' aria-label='Select language'>
              <SelectValue placeholder='Language' />
            </SelectTrigger>
            <SelectContent position='popper' align='start'>
              <SelectItem value='zh'>Chinese</SelectItem>
              <SelectItem value='en'>English</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className='border-t pt-3'>
        <Calendar
          mode='range'
          selected={dateRange}
          onSelect={setDateRange}
          defaultMonth={dateRange?.from}
          locale={locale === 'zh' ? zhCN : enUS}
          numerals='latn'
          className='w-full bg-transparent p-0'
          buttonVariant='ghost'
        />
      </CardContent>
    </Card>
  );
}
