import { expect, within } from 'storybook/test';
import { chartsMeta, forcedState, ready, stateData } from '../story-helpers.jsx';
import { RadialBarChart } from './index.js';

const goals = [
  { label: 'Essays published', value: 75 },
  { label: 'Newsletter growth', value: 62 },
  { label: 'Talks given', value: 40 }
];

export default {
  title: 'Charts/RadialChart',
  id: 'charts-radialchart',
  tags: ['autodocs'],
  ...chartsMeta('RadialChart', { component: RadialBarChart, controls: {}, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Goals this year', description: 'Progress towards each goal, as a percentage.', height: 300, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Progress against a full 0–100 track, one ring per goal (RadialBarChart). Values are percentages; the track is the whole range.' },
      source: {
        language: 'jsx',
        code: `import { RadialBarChart } from '@gaudi/design-system/charts';

<RadialBarChart title='Goals this year' ariaLabel='Progress towards each goal' data={goals} />`
      }
    }
  },
  render: ({ state, ...args }) => <RadialBarChart {...args} ariaLabel='Progress towards each goal' data={stateData(state, goals)} state={forcedState(state)} />,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await ready(canvasElement, 'Progress towards each goal');
    await expect(within(canvasElement).getByRole('cell', { name: '62%' })).toBeInTheDocument();
  }
};

export const SingleRing = {
  name: 'One measure with a caption',
  parameters: { docs: { description: { story: 'A single ring for one progress measure, such as how far readers get through an essay on average.' } } },
  render: () => (
    <div className='w-full max-w-xs'>
      <RadialBarChart title='Read completion' description='Average share of the essay read.' ariaLabel='Average read completion' data={[{ label: 'Read completion', value: 78 }]} height={220} />
    </div>
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Average read completion')
};

export const Coloured = {
  name: 'Custom colours per ring',
  parameters: { docs: { description: { story: '`colors` picks the ring colours from the chart palette tokens, for a release checklist where each ring is a track of work.' } } },
  render: () => (
    <RadialBarChart
      title='Release 2.0 readiness'
      ariaLabel='Release readiness by track'
      data={[{ label: 'Docs', value: 90 }, { label: 'Tests', value: 74 }, { label: 'Migration', value: 48 }]}
      colors={[ 'var(--ds-color-chart-positive)', 'var(--ds-color-chart-3)', 'var(--ds-color-warning)' ]}
      height={260}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Release readiness by track')
};
