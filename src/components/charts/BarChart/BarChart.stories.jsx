import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chartsMeta, forcedState, focusPlot, readout, ready, stateData } from '../story-helpers.jsx';
import { BarChart } from './index.js';

// Monthly readers by acquisition channel.
const readers = [
  { label: 'Jan', search: 1840, newsletter: 920, social: 610 },
  { label: 'Feb', search: 2110, newsletter: 1040, social: 480 },
  { label: 'Mar', search: 2380, newsletter: 1180, social: 1320 },
  { label: 'Apr', search: 2260, newsletter: 1310, social: 760 },
  { label: 'May', search: 2790, newsletter: 1460, social: 890 },
  { label: 'Jun', search: 3120, newsletter: 1620, social: 1040 }
];
const channels = [
  { key: 'search', label: 'Search' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'social', label: 'Social' }
];

export default {
  title: 'Charts/BarChart',
  id: 'charts-barchart',
  tags: ['autodocs'],
  ...chartsMeta('BarChart', { component: BarChart, controls: { layout: [ 'vertical', 'horizontal' ], stacked: 'boolean', showGrid: 'boolean', showLegend: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Readers by channel', description: 'Monthly unique readers, January to June.', height: 300, layout: 'vertical', stacked: false, showGrid: true, showLegend: true, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Grouped bars per month. `stacked` adds the channels into one bar, `layout` turns the chart on its side, `state` previews loading, empty, invalid and error, and `locale` reformats every number. Tab to the plot and use the arrow keys to read each month.' },
      source: {
        language: 'jsx',
        code: `import { BarChart } from '@gaudi/design-system/charts';

<BarChart
  title='Readers by channel'
  description='Monthly unique readers, January to June.'
  ariaLabel='Monthly readers by channel'
  data={readers}
  series={[{ key: 'search', label: 'Search' }, { key: 'newsletter', label: 'Newsletter' }, { key: 'social', label: 'Social' }]}
  showLegend
  showData='toggle'
/>`
      }
    }
  },
  render: ({ state, ...args }) => <BarChart {...args} ariaLabel='Monthly readers by channel' data={stateData(state, readers)} series={channels} state={forcedState(state)} />,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await ready(canvasElement, 'Monthly readers by channel');
    await focusPlot(canvasElement, 'Monthly readers by channel');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Jan: Search 1,840/));
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Feb: Search 2,110/));
  }
};

// Posts ranked by reads: long titles read better on their side.
const topPosts = [
  { label: 'Notes on local-first software', reads: 8420 },
  { label: 'Small tools, long lifetimes', reads: 6130 },
  { label: 'Designing for real data', reads: 5270 },
  { label: 'A practical guide to knowledge graphs', reads: 4890 },
  { label: 'Running a calm team', reads: 3310 }
];

export const Horizontal = {
  name: 'Horizontal bars for long labels',
  parameters: { docs: { description: { story: 'Ranked posts with `layout="horizontal"`, so long titles sit on the category axis instead of being cut off. The average is a labelled reference line.' } } },
  render: () => (
    <BarChart
      title='Most read this quarter'
      ariaLabel='Reads per post this quarter'
      data={topPosts}
      yKey='reads'
      layout='horizontal'
      height={300}
      references={[{ x: 5604, label: 'Average', tone: 'neutral' }]}
    />
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Reads per post this quarter');
    await expect(within(canvasElement).getByRole('rowheader', { name: 'Running a calm team' })).toBeInTheDocument();
  }
};

// Build minutes per week by pipeline stage.
const builds = [
  { label: 'W1', install: 42, test: 96, deploy: 18 },
  { label: 'W2', install: 38, test: 104, deploy: 21 },
  { label: 'W3', install: 35, test: 88, deploy: 19 },
  { label: 'W4', install: 31, test: 72, deploy: 16 },
  { label: 'W5', install: 29, test: 64, deploy: 15 }
];

export const Stacked = {
  name: 'Stacked with a target',
  parameters: { docs: { description: { story: 'Build minutes per week stacked by pipeline stage, with the 120-minute budget as a reference line. Stacking keeps the total readable while showing which stage shrank.' } } },
  render: () => (
    <BarChart
      title='CI minutes per week'
      description='Install, test and deploy, against the 120-minute budget.'
      ariaLabel='CI minutes per week by stage'
      data={builds}
      series={[{ key: 'install', label: 'Install' }, { key: 'test', label: 'Test' }, { key: 'deploy', label: 'Deploy' }]}
      stacked
      showLegend
      references={[{ y: 120, label: 'Budget', tone: 'warning' }]}
      formatValue={(value) => `${value} min`}
    />
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'CI minutes per week by stage');
    await expect(within(canvasElement).getAllByRole('cell', { name: '96 min' }).length).toBeGreaterThan(0);
  }
};

const releases = [
  { label: 'v1.8', fixes: 14 },
  { label: 'v1.9', fixes: 22 },
  { label: 'v2.0', fixes: 41 },
  { label: 'v2.1', fixes: 17 },
  { label: 'v2.2', fixes: 9 }
];

function HighlightRelease() {
  const [ picked, setPicked ] = useState('v2.0');

  return (
    <div className='grid gap-3'>
      <BarChart
        title='Fixes per release'
        ariaLabel='Bug fixes per release'
        data={releases}
        yKey='fixes'
        highlight={picked}
        onActivate={(point) => setPicked(point.label)}
        height={260}
      />
      <p className='text-sm text-text-muted' data-testid='picked-release'>
        Showing <span className='font-medium text-text'>{picked}</span>. Click a bar, or press Enter on it, to read another release.
      </p>
    </div>
  );
}

export const Highlighted = {
  name: 'Highlight and activate a bar',
  parameters: { docs: { description: { story: '`highlight` dims every bar but one so the paragraph beside it can point at a release; `onActivate` (click, Enter or Space) moves the highlight.' } } },
  render: () => <HighlightRelease />,
  play: async ({ canvasElement }) => {
    await focusPlot(canvasElement, 'Bug fixes per release');
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await waitFor(() => expect(within(canvasElement).getByTestId('picked-release')).toHaveTextContent('v1.9'));
  }
};
