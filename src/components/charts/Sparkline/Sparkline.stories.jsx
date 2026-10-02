import { expect, within } from 'storybook/test';
import { chartsMeta, forcedState, ready, stateData } from '../story-helpers.jsx';
import { Sparkline } from './index.js';

const readers = [ 920, 1040, 980, 1180, 1310, 1240, 1460, 1390, 1620, 1580, 1710, 1840, 1790, 1960 ];

export default {
  title: 'Charts/Sparkline',
  id: 'charts-sparkline',
  tags: ['autodocs'],
  ...chartsMeta('Sparkline', { component: Sparkline, controls: { variant: [ 'line', 'area', 'bar' ], showEndpoint: 'boolean', reference: 'number' }, primary: () => Playground })
};

export const Playground = {
  args: { variant: 'area', showEndpoint: true, reference: 1400, height: 64, showData: 'hidden', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'A word-sized trend without axes: `variant` draws a line, an area or bars, `reference` adds a dashed guide such as a target, and `showEndpoint` marks the latest value. It keeps the full frame: name it with `ariaLabel` and the values stay in the data table.' },
      source: {
        language: 'jsx',
        code: `import { Sparkline } from '@gaudi/design-system/charts';

<Sparkline ariaLabel='Readers, last 14 days' data={readers} variant='area' reference={1400} height={64} />`
      }
    }
  },
  render: ({ state, ...args }) => (
    <div className='w-56'>
      <Sparkline {...args} ariaLabel='Readers, last 14 days' data={stateData(state, readers)} state={forcedState(state)} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    if (args.state === 'ready') await ready(canvasElement, 'Readers, last 14 days');
  }
};

const metrics = [
  { name: 'Readers', value: '1,960', change: '+12%', data: readers, variant: 'area' },
  { name: 'Signups', value: '84', change: '+31%', data: [ 41, 38, 52, 47, 63, 58, 44, 71, 96, 88, 74, 69, 61, 84 ], variant: 'bar' },
  { name: 'Bounce rate', value: '38%', change: '−4 pts', data: [ 46, 45, 44, 44, 43, 42, 42, 41, 40, 40, 39, 39, 38, 38 ], variant: 'line' }
];

export const InTable = {
  name: 'Trends in a table',
  parameters: { docs: { description: { story: 'One sparkline per row of a metrics table. Each trend is still a named, keyboard-reachable chart, so a screen reader gets the values the eye reads from the shape.' } } },
  render: () => (
    <table className='w-full max-w-xl text-sm [&_td]:pe-3 [&_th]:pe-3'>
      <thead className='text-left text-text-muted'>
        <tr><th className='py-2 font-medium'>Metric</th><th className='py-2 font-medium'>Today</th><th className='py-2 font-medium'>Change</th><th className='py-2 font-medium'>14 days</th></tr>
      </thead>
      <tbody>
        {metrics.map((metric) => (
          <tr key={metric.name} className='border-t'>
            <td className='py-2 font-medium'>{metric.name}</td>
            <td className='py-2 tabular-nums'>{metric.value}</td>
            <td className='py-2 tabular-nums text-text-muted'>{metric.change}</td>
            <td className='w-40 py-2'><Sparkline ariaLabel={`${metric.name}, last 14 days`} data={metric.data} variant={metric.variant} height={32} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
  play: async ({ canvasElement }) => {
    for (const metric of metrics) await ready(canvasElement, `${metric.name}, last 14 days`);
  }
};

export const Inline = {
  name: 'Inline in prose',
  parameters: { docs: { description: { story: 'A sparkline sized to a line of text, inside an article paragraph, so the trend sits right next to the sentence that describes it.' } } },
  render: () => (
    <p className='max-w-xl text-base leading-7'>
      Reading time held steady through the redesign
      <span className='mx-1 inline-block w-24 align-middle'><Sparkline ariaLabel='Minutes read per visit, last 8 weeks' data={[ 4.1, 4.3, 4.2, 4.4, 4.6, 4.5, 4.8, 4.9 ]} height={22} showEndpoint={false} /></span>
      and climbed once the new typography shipped.
    </p>
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Minutes read per visit, last 8 weeks');
    await expect(within(canvasElement).getByText(/held steady/)).toBeVisible();
  }
};
