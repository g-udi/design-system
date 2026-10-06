import { PlaygroundExample, ComparisonExample, SingleExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chartsMeta, focusPlot, readout, ready } from '../../stories/story-helpers.jsx';
import { RadarChart } from '../index.js';

// An editor's review of a draft against the house target.

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/RadarChart',
  id: 'charts-radarchart',
  tags: ['autodocs'],
  ...chartsMeta('RadarChart', { component: RadarChart, controls: { filled: 'boolean', showRings: 'boolean', showLegend: 'boolean' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Draft review', description: 'Scores out of 100 against the house target.', height: 340, filled: true, showRings: true, showLegend: true, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Scores on six axes at once. One record per axis, a value per series; the dashed series reads as the target. `domain` fixes the 0–100 scale so two drafts compare, and the arrow keys walk the axes.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await focusPlot(canvasElement, 'Draft scores against the target');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Clarity: Draft 72, Target 85'));
    await waitFor(() => {
      const legend = canvasElement.querySelector('.recharts-default-legend');
      const axes = [...canvasElement.querySelectorAll('.recharts-polar-angle-axis-tick-value')];
      const lowestLabel = Math.max(...axes.map((label) => label.getBoundingClientRect().bottom));
      expect(legend.getBoundingClientRect().top).toBeGreaterThan(lowestLabel + 4);
    });
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Evidence: Draft 58, Target 75'));
  }
};

export const Comparison = {
  name: 'Compare three options',
  parameters: { docs: { description: { story: 'Three outlines without fills, for an article that compares site frameworks. Unfilled series keep overlaps readable.' } } },
  render: ComparisonExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Framework scores by criterion');
    await expect(within(canvasElement).getAllByRole('cell', { name: '95' }).length).toBeGreaterThan(0);
  }
};

export const Single = {
  name: 'One series without rings',
  parameters: { docs: { description: { story: 'A single skills profile with the ring labels hidden, where the shape matters more than exact values. The data table still carries every score.' } } },
  render: SingleExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Team skills profile')
};
