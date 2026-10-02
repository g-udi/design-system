import { expect, within } from 'storybook/test';
import { chartsMeta, forcedState, ready, stateData } from '../story-helpers.jsx';
import { BoxPlotChart } from './index.js';

// Page load time in milliseconds, sampled per template.
const templates = [
  { label: 'Home', values: [ 410, 460, 480, 520, 540, 580, 610, 640, 690, 1420 ] },
  { label: 'Essay', values: [ 520, 560, 610, 640, 660, 700, 740, 790, 860 ] },
  { label: 'Archive', values: [ 380, 400, 420, 450, 470, 500, 520, 560 ] },
  { label: 'Search', values: [ 640, 710, 760, 820, 880, 940, 1010, 1100, 1860, 2140 ] }
];

export default {
  title: 'Charts/BoxPlotChart',
  id: 'charts-boxplotchart',
  tags: ['autodocs'],
  ...chartsMeta('BoxPlotChart', { component: BoxPlotChart, controls: { unit: 'text' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Load time by template', description: 'Median, quartiles, whiskers at 1.5 × IQR and slow outliers.', height: 300, unit: 'ms', showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Distributions side by side. Pass raw `values` per group and the chart computes the five-number summary and outliers, or pass precomputed `min`, `q1`, `median`, `q3`, `max` and `outliers`.' },
      source: {
        language: 'jsx',
        code: `import { BoxPlotChart } from '@gaudi/design-system/charts';

<BoxPlotChart
  title='Load time by template'
  ariaLabel='Page load time distribution by template'
  data={[{ label: 'Home', values: [410, 460, 480, 520, 1420] }]}
  unit='ms'
/>`
      }
    }
  },
  render: ({ state, ...args }) => <BoxPlotChart {...args} ariaLabel='Page load time distribution by template' data={stateData(state, templates)} state={forcedState(state)} />,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await ready(canvasElement, 'Page load time distribution by template');
    await expect(within(canvasElement).getByRole('rowheader', { name: 'Search' })).toBeInTheDocument();
  }
};

export const Precomputed = {
  name: 'Precomputed summaries',
  parameters: { docs: { description: { story: 'Summaries already computed by the analytics backend: pass the five numbers and outliers directly instead of raw samples.' } } },
  render: () => (
    <BoxPlotChart
      title='Words per essay by section'
      ariaLabel='Essay length distribution by section'
      data={[
        { label: 'Engineering', min: 900, q1: 1800, median: 2600, q3: 3400, max: 4800, outliers: [ 7200 ] },
        { label: 'Data', min: 1100, q1: 1900, median: 2400, q3: 3100, max: 4200 },
        { label: 'Notes', min: 200, q1: 450, median: 700, q3: 950, max: 1400, outliers: [ 2600 ] }
      ]}
      height={260}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Essay length distribution by section')
};

export const Regions = {
  name: 'Regions with a custom colour',
  parameters: { docs: { description: { story: 'Response time per region in one palette colour, with the median and quartiles read out by the arrow keys.' } } },
  render: () => (
    <BoxPlotChart
      title='API response time by region'
      ariaLabel='API response time distribution by region'
      data={[{ label: 'Europe', values: [ 82, 90, 96, 104, 118, 126, 140, 310 ] }, { label: 'Americas', values: [ 110, 124, 128, 140, 152, 170, 188 ] }, { label: 'Asia', values: [ 160, 178, 190, 210, 236, 260, 290, 640 ] }]}
      color='var(--ds-color-chart-3)'
      unit='ms'
      height={260}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'API response time distribution by region')
};
