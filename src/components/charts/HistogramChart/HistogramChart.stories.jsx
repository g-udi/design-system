import { expect, within } from 'storybook/test';
import { chartsMeta, forcedState, ready } from '../story-helpers.jsx';
import { HistogramChart } from './index.js';

// Page weight of 48 essays in kilobytes.
const weights = [ 180, 210, 240, 260, 280, 290, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 470, 480, 500, 520, 540, 560, 580, 600, 620, 650, 680, 700, 740, 780, 820, 860, 900, 960, 1020, 1100, 1180, 1260, 1400, 1520, 1700, 1980, 2400 ];

export default {
  title: 'Charts/HistogramChart',
  id: 'charts-histogramchart',
  tags: ['autodocs'],
  ...chartsMeta('HistogramChart', { component: HistogramChart, controls: { bins: 'number', unit: 'text' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Page weight across essays', description: 'Kilobytes per page for 48 essays, with the budget and the median.', height: 300, bins: 10, unit: '', showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Observations in round bins: `bins` is approximate because the edges snap to round numbers. `markers` add labelled guides such as the median or a budget.' },
      source: {
        language: 'jsx',
        code: `import { HistogramChart } from '@gaudi/design-system/charts';

<HistogramChart
  title='Page weight across essays'
  ariaLabel='Distribution of page weight across essays'
  values={weights}
  bins={10}
  unit=' KB'
  markers={[{ value: 520, label: 'Median' }, { value: 1000, label: 'Budget', tone: 'danger' }]}
/>`
      }
    }
  },
  render: ({ state, ...args }) => (
    <HistogramChart
      {...args}
      ariaLabel='Distribution of page weight across essays'
      values={state === 'empty' ? [] : state === 'invalid' ? [ 'heavy' ] : weights}
      markers={[{ value: 520, label: 'Median' }, { value: 1000, label: 'Budget', tone: 'danger' }]}
      state={forcedState(state)}
    />
  ),
  play: async ({ args, canvasElement }) => {
    if (args.state === 'ready') await ready(canvasElement, 'Distribution of page weight across essays');
  }
};

// Session length in minutes, bimodal: quick visits and deep reads.
const sessions = [ 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 5, 6, 8, 9, 10, 11, 11, 12, 12, 12, 13, 13, 14, 14, 15, 16, 18, 22 ];

export const Bimodal = {
  name: 'Two kinds of visit',
  parameters: { docs: { description: { story: 'A bimodal distribution where an average would mislead: quick visits and deep reads, marked separately.' } } },
  render: () => (
    <HistogramChart
      title='Session length'
      ariaLabel='Distribution of session length in minutes'
      values={sessions}
      bins={8}
      unit=' min'
      markers={[{ value: 2, label: 'Skim' }, { value: 12, label: 'Deep read', tone: 'success' }]}
      height={240}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Distribution of session length in minutes')
};

export const FixedDomain = {
  name: 'Fixed domain and count label',
  parameters: { docs: { description: { story: '`domain` pins the axis from 0 to 100 so two score histograms compare; `countLabel` names the counts in the table.' } } },
  render: () => (
    <HistogramChart
      title='Accessibility scores'
      ariaLabel='Distribution of accessibility scores across pages'
      values={[ 62, 70, 74, 78, 81, 83, 85, 86, 88, 89, 90, 91, 92, 93, 95, 96, 98, 100 ]}
      domain={[ 0, 100 ]}
      bins={10}
      countLabel='Pages'
      height={240}
      showData='visible'
    />
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Distribution of accessibility scores across pages');
    await expect(within(canvasElement).getAllByRole('columnheader', { name: 'Pages' }).length).toBeGreaterThan(0);
  }
};
