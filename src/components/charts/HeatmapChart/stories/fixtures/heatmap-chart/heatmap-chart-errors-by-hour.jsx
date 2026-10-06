'use client';
import { useState } from 'react';
import { HeatmapChart } from '@gaudi/design-system/charts/HeatmapChart';
import { ToggleGroupRoot as ToggleGroup, ToggleGroupItem } from '@gaudi/design-system/core/ToggleGroup';

const services = [ 'Web', 'API', 'Search', 'Mailer', 'Worker' ];
const hours = [ '00', '03', '06', '09', '12', '15', '18', '21' ].map((hour) => `${hour}:00`);
// Errors per three hours, and the change against the same hours last week.
const errors = [
  [ 2, 1, 3, 12, 18, 9, 6, 4 ],
  [ 5, 3, 4, 21, 34, 27, 15, 8 ],
  [ 0, 1, 1, 6, 9, 11, 7, 2 ],
  [ 1, 0, 14, 3, 2, 2, 1, 1 ],
  [ 7, 9, 6, 5, 8, 6, 4, 6 ]
];
const change = [
  [ -1, 0, 1, 4, 6, -2, -1, 0 ],
  [ 2, 1, -1, 9, 14, 6, -3, -2 ],
  [ 0, 0, -1, -2, 3, 5, 2, -1 ],
  [ 0, -1, 11, -1, -2, 0, 0, 0 ],
  [ -4, -2, -1, 0, 1, -3, -2, 1 ]
];
const cells = (matrix) => services.flatMap((service, row) => hours.map((hour, column) => ({ x: hour, y: service, value: matrix[row][column] })));

export function Pattern() {
  const [view, setView] = useState('errors');
  return (
    <HeatmapChart
      ariaLabel={view === 'errors' ? 'Errors by service and time of day' : 'Change in errors against last week'}
      title='Errors by service'
      description={view === 'errors' ? 'Errors in each three-hour window, today.' : 'More errors than last week in rose, fewer in blue.'}
      toolbar={
        <ToggleGroup aria-label='Measure' type='single' variant='outline' size='sm' spacing={0} value={view} onValueChange={(next) => next && setView(next)}>
          <ToggleGroupItem value='errors'>Errors</ToggleGroupItem>
          <ToggleGroupItem value='change'>Change</ToggleGroupItem>
        </ToggleGroup>
      }
      data={cells(view === 'errors' ? errors : change)}
      scale={view === 'errors' ? 'sequential' : 'diverging'}
      valueLabel={view === 'errors' ? 'Errors' : 'Change'}
      xLabels={hours}
      yLabels={services}
      className='my-0 w-full max-w-3xl'
    />
  );
}
