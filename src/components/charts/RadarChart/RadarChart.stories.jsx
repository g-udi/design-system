import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chartsMeta, forcedState, focusPlot, readout, ready, stateData } from '../story-helpers.jsx';
import { RadarChart } from './index.js';

// An editor's review of a draft against the house target.
const review = [
  { label: 'Clarity', draft: 72, target: 85 },
  { label: 'Structure', draft: 81, target: 80 },
  { label: 'Evidence', draft: 58, target: 75 },
  { label: 'Voice', draft: 88, target: 80 },
  { label: 'Length', draft: 64, target: 70 },
  { label: 'Accessibility', draft: 76, target: 90 }
];

export default {
  title: 'Charts/RadarChart',
  id: 'charts-radarchart',
  tags: ['autodocs'],
  ...chartsMeta('RadarChart', { component: RadarChart, controls: { filled: 'boolean', showRings: 'boolean', showLegend: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Draft review', description: 'Scores out of 100 against the house target.', height: 340, filled: true, showRings: true, showLegend: true, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Scores on six axes at once. One record per axis, a value per series; the dashed series reads as the target. `domain` fixes the 0–100 scale so two drafts compare, and the arrow keys walk the axes.' },
      source: {
        language: 'jsx',
        code: `import { RadarChart } from '@gaudi/design-system/charts';

<RadarChart
  title='Draft review'
  ariaLabel='Draft scores against the target'
  data={review}
  series={[{ key: 'draft', label: 'Draft' }, { key: 'target', label: 'Target', dashed: true }]}
  domain={[0, 100]}
/>`
      }
    }
  },
  render: ({ state, ...args }) => (
    <RadarChart
      {...args}
      ariaLabel='Draft scores against the target'
      data={stateData(state, review)}
      series={[{ key: 'draft', label: 'Draft' }, { key: 'target', label: 'Target', dashed: true }]}
      domain={[ 0, 100 ]}
      state={forcedState(state)}
    />
  ),
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await focusPlot(canvasElement, 'Draft scores against the target');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Clarity: Draft 72, Target 85'));
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Evidence: Draft 58, Target 75'));
  }
};

const frameworks = [
  { label: 'Performance', astro: 92, next: 81, remix: 84 },
  { label: 'Ecosystem', astro: 68, next: 94, remix: 72 },
  { label: 'DX', astro: 86, next: 82, remix: 80 },
  { label: 'Hosting', astro: 88, next: 85, remix: 76 },
  { label: 'Content', astro: 95, next: 74, remix: 66 }
];

export const Comparison = {
  name: 'Compare three options',
  parameters: { docs: { description: { story: 'Three outlines without fills, for an article that compares site frameworks. Unfilled series keep overlaps readable.' } } },
  render: () => (
    <RadarChart
      title='Choosing a framework for the blog'
      ariaLabel='Framework scores by criterion'
      data={frameworks}
      series={[{ key: 'astro', label: 'Astro' }, { key: 'next', label: 'Next.js' }, { key: 'remix', label: 'Remix' }]}
      filled={false}
      domain={[ 0, 100 ]}
    />
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Framework scores by criterion');
    await expect(within(canvasElement).getAllByRole('cell', { name: '95' }).length).toBeGreaterThan(0);
  }
};

export const Single = {
  name: 'One series without rings',
  parameters: { docs: { description: { story: 'A single skills profile with the ring labels hidden, where the shape matters more than exact values. The data table still carries every score.' } } },
  render: () => (
    <RadarChart
      title='Team skills'
      ariaLabel='Team skills profile'
      data={[{ label: 'Design', value: 7 }, { label: 'Frontend', value: 9 }, { label: 'Backend', value: 6 }, { label: 'Data', value: 5 }, { label: 'Writing', value: 8 }]}
      domain={[ 0, 10 ]}
      showRings={false}
      showLegend={false}
      height={280}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Team skills profile')
};
