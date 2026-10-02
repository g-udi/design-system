import { expect, within } from 'storybook/test';
import { chartsMeta, forcedState, ready, stateData } from '../story-helpers.jsx';
import { WaterfallChart } from './index.js';

// Subscribers from one month to the next.
const subscribers = [
  { label: 'September', value: 4180, total: true },
  { label: 'Organic', value: 620 },
  { label: 'Referrals', value: 240 },
  { label: 'Imports', value: 180 },
  { label: 'Unsubscribed', value: -310 },
  { label: 'Bounced', value: -95 },
  { label: 'October', total: true }
];

export default {
  title: 'Charts/WaterfallChart',
  id: 'charts-waterfallchart',
  tags: ['autodocs'],
  ...chartsMeta('WaterfallChart', { component: WaterfallChart, controls: { showGrid: 'boolean', changeLabel: 'text', totalLabel: 'text' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Subscribers in October', description: 'How September’s list became October’s.', height: 300, showGrid: true, changeLabel: 'Change', totalLabel: 'Subscribers', showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Increases and decreases between two totals. A step with `total: true` draws the running total (or its own `value`); increases and decreases use the positive and negative chart tokens.' },
      source: {
        language: 'jsx',
        code: `import { WaterfallChart } from '@gaudi/design-system/charts';

<WaterfallChart
  title='Subscribers in October'
  ariaLabel='Change in subscribers from September to October'
  data={[
    { label: 'September', value: 4180, total: true },
    { label: 'Organic', value: 620 },
    { label: 'Unsubscribed', value: -310 },
    { label: 'October', total: true }
  ]}
/>`
      }
    }
  },
  render: ({ state, ...args }) => <WaterfallChart {...args} ariaLabel='Change in subscribers from September to October' data={stateData(state, subscribers)} state={forcedState(state)} />,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await ready(canvasElement, 'Change in subscribers from September to October');
    await expect(within(canvasElement).getAllByRole('cell', { name: '4,815' }).length).toBeGreaterThan(0);
  }
};

// Page weight budget: from the old page to the new one.
const pageWeight = [
  { label: 'Before', value: 1840, total: true },
  { label: 'Images to AVIF', value: -620 },
  { label: 'Font subsetting', value: -180 },
  { label: 'Analytics script', value: 45 },
  { label: 'Code splitting', value: -310 },
  { label: 'After', total: true }
];

export const Budget = {
  name: 'Performance budget bridge',
  parameters: { docs: { description: { story: 'Kilobytes saved or added by each change between two versions of a page, formatted with a unit, for a performance write-up.' } } },
  render: () => (
    <WaterfallChart
      title='Where the page weight went'
      ariaLabel='Change in page weight by optimisation'
      data={pageWeight}
      changeLabel='Saved or added'
      totalLabel='Page weight'
      formatValue={(value) => `${value} KB`}
    />
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Change in page weight by optimisation');
    await expect(within(canvasElement).getAllByRole('cell', { name: '775 KB' }).length).toBeGreaterThan(0);
  }
};

export const Subtotals = {
  name: 'Subtotals inside the bridge',
  parameters: { docs: { description: { story: 'A quarterly bridge with a subtotal after each month, so the reader sees where the quarter turned.' } } },
  render: () => (
    <WaterfallChart
      title='Active workspaces this quarter'
      ariaLabel='Active workspaces with monthly subtotals'
      data={[
        { label: 'Start', value: 1200, total: true },
        { label: 'Jul new', value: 140 }, { label: 'Jul lost', value: -60 }, { label: 'End of Jul', total: true },
        { label: 'Aug new', value: 90 }, { label: 'Aug lost', value: -110 }, { label: 'End of Aug', total: true },
        { label: 'Sep new', value: 210 }, { label: 'Sep lost', value: -70 }, { label: 'End of Sep', total: true }
      ]}
      height={280}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Active workspaces with monthly subtotals')
};
