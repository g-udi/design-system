// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { DateSelector } from '../../../../src/components/core/Calendar/parts/date-selector-extended.jsx';
import { format } from 'date-fns';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
export function Pattern() {
  const [value, setValue] = useState();
  return (
    <div className='flex w-full flex-col items-center gap-5'>
      <Card className='w-full max-w-lg p-0'>
        <CardContent className='p-3'>
          <DateSelector
            value={value}
            onChange={setValue}
            label='Due date'
            inputHint='Try: 2025, Q4, 05/10/2025'
          />
        </CardContent>
      </Card>

      {value ? (
        <pre className='bg-ui-muted w-full overflow-auto rounded-md p-3 font-mono text-xs md:w-[500px]'>
          {JSON.stringify(
            value,
            (key, val) => {
              if (val instanceof Date) {
                return format(val, 'MM/dd/yyyy');
              }
              return val;
            },
            2
          )}
        </pre>
      ) : (
        <div className='text-ui-muted-foreground text-sm'>
          No value selected. Select a date to see the debug information.
        </div>
      )}
    </div>
  );
}
