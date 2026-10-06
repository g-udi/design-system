import { Sparkline } from '@gaudi/design-system/charts/Sparkline';
import { stateData, forcedState } from '../../../stories/chartExamples.js';
import { TableRoot, TableHeader, TableRowPrimitive as TableRow, TableHeadPrimitive as TableHead, TableBodyPrimitive as TableBody, TableCellPrimitive as TableCell } from '@gaudi/design-system/mdx/Table';

export const readers = [ 920, 1040, 980, 1180, 1310, 1240, 1460, 1390, 1620, 1580, 1710, 1840, 1790, 1960 ];

export const metrics = [
  { name: 'Readers', value: '1,960', change: '+12%', data: readers, variant: 'area' },
  { name: 'Signups', value: '84', change: '+31%', data: [ 41, 38, 52, 47, 63, 58, 44, 71, 96, 88, 74, 69, 61, 84 ], variant: 'bar' },
  { name: 'Bounce rate', value: '38%', change: '−4 pts', data: [ 46, 45, 44, 44, 43, 42, 42, 41, 40, 40, 39, 39, 38, 38 ], variant: 'line' }
];

export const PlaygroundExample = ({ state, ...args }) => (
    <div className='w-56'>
      <Sparkline {...args} ariaLabel='Readers, last 14 days' data={stateData(state, readers)} state={forcedState(state)} />
    </div>
  );

export const InTableExample = () => (
    <TableRoot aria-label='Metrics and 14-day trends' containerProps={{ className: 'max-w-xl' }}>
      <TableHeader>
        <TableRow><TableHead scope='col'>Metric</TableHead><TableHead scope='col'>Today</TableHead><TableHead scope='col'>Change</TableHead><TableHead scope='col'>14 days</TableHead></TableRow>
      </TableHeader>
      <TableBody>
        {metrics.map((metric) => (
          <TableRow key={metric.name}>
            <TableCell as='th' scope='row'>{metric.name}</TableCell>
            <TableCell className='tabular-nums'>{metric.value}</TableCell>
            <TableCell className='tabular-nums text-text-muted'>{metric.change}</TableCell>
            <TableCell className='w-40 min-w-32'><Sparkline ariaLabel={`${metric.name}, last 14 days`} data={metric.data} variant={metric.variant} height={32} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  );

export const InlineExample = () => (
    <div className='max-w-xl text-base leading-7'>
      Reading time held steady through the redesign
      <div className='mx-1 inline-block w-24 align-middle'><Sparkline ariaLabel='Minutes read per visit, last 8 weeks' data={[ 4.1, 4.3, 4.2, 4.4, 4.6, 4.5, 4.8, 4.9 ]} height={22} showEndpoint={false} /></div>
      and climbed once the new typography shipped.
    </div>
  );
