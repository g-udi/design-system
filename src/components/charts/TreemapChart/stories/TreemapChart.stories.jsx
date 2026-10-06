import { PlaygroundExample, FlatExample, SpendExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, within } from 'storybook/test';
import { chartsMeta, ready } from '../../stories/story-helpers.jsx';
import { TreemapChart } from '../index.js';

// Reading time by section of the site, in hours this month.

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/TreemapChart',
  id: 'charts-treemapchart',
  tags: ['autodocs'],
  ...chartsMeta('TreemapChart', { component: TreemapChart, controls: { colorBy: [ 'group', 'value' ] }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Reading time by section', description: 'Hours read this month.', height: 320, colorBy: 'group', showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Nested rectangles sized by value. `colorBy="group"` tints each top-level section; `"value"` shades every rectangle on the heat ramp. Leaves are points for the arrow keys.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await ready(canvasElement, 'Hours read by section');
    await expect(within(canvasElement).getByRole('rowheader', { name: 'Essays · Engineering' })).toBeInTheDocument();
  }
};

export const Flat = {
  name: 'One level shaded by value',
  parameters: { docs: { description: { story: 'A flat list of dependencies by bundle size, shaded on the heat ramp so the largest stand out.' } } },
  render: FlatExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Bundle size by package')
};

export const Spend = {
  name: 'Spend by team',
  parameters: { docs: { description: { story: 'Monthly tool spend by team and service, formatted as currency.' } } },
  render: SpendExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Monthly tool spend by team and service')
};
