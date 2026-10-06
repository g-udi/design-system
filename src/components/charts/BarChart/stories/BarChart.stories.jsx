import { PlaygroundExample, HorizontalExample, StackedExample, HighlightedExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';

import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chartsMeta, focusPlot, readout, ready } from '../../stories/story-helpers.jsx';
import { BarChart } from '../index.js';

// Monthly readers by acquisition channel.

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/BarChart',
  id: 'charts-barchart',
  tags: ['autodocs'],
  ...chartsMeta('BarChart', { component: BarChart, controls: { layout: [ 'vertical', 'horizontal' ], stacked: 'boolean', showGrid: 'boolean', showLegend: 'boolean' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Readers by channel', description: 'Monthly unique readers, January to June.', height: 300, layout: 'vertical', stacked: false, showGrid: true, showLegend: true, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Grouped bars per month. `stacked` adds the channels into one bar, `layout` turns the chart on its side, `state` previews loading, empty, invalid and error, and `locale` reformats every number. Tab to the plot and use the arrow keys to read each month.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
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

export const Horizontal = {
  name: 'Horizontal bars for long labels',
  parameters: { docs: { description: { story: 'Ranked posts with `layout="horizontal"`, so long titles sit on the category axis instead of being cut off. The average is a labelled reference line.' } } },
  render: HorizontalExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Reads per post this quarter');
    await expect(within(canvasElement).getByRole('rowheader', { name: 'Running a calm team' })).toBeInTheDocument();
  }
};

// Build minutes per week by pipeline stage.

export const Stacked = {
  name: 'Stacked with a target',
  parameters: { docs: { description: { story: 'Build minutes per week stacked by pipeline stage, with the 120-minute budget as a reference line. Stacking keeps the total readable while showing which stage shrank.' } } },
  render: StackedExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'CI minutes per week by stage');
    await expect(within(canvasElement).getAllByRole('cell', { name: '96 min' }).length).toBeGreaterThan(0);
  }
};

export const Highlighted = {
  name: 'Highlight and activate a bar',
  parameters: { docs: { description: { story: '`highlight` dims every bar but one so the paragraph beside it can point at a release; `onActivate` (click, Enter or Space) moves the highlight.' } } },
  render: HighlightedExample,
  play: async ({ canvasElement }) => {
    await focusPlot(canvasElement, 'Bug fixes per release');
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await waitFor(() => expect(within(canvasElement).getByTestId('picked-release')).toHaveTextContent('v1.9'));
  }
};
