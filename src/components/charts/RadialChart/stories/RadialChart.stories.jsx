import { PlaygroundExample, SingleRingExample, ColouredExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, within } from 'storybook/test';
import { chartsMeta, ready } from '../../stories/story-helpers.jsx';
import { RadialBarChart } from '../index.js';

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/RadialChart',
  id: 'charts-radialchart',
  tags: ['autodocs'],
  ...chartsMeta('RadialChart', { component: RadialBarChart, controls: {}, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Goals this year', description: 'Progress towards each goal, as a percentage.', height: 300, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Progress against a full 0–100 track, one ring per goal (RadialBarChart). Values are percentages; the track is the whole range.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await ready(canvasElement, 'Progress towards each goal');
    await expect(within(canvasElement).getByRole('cell', { name: '62%' })).toBeInTheDocument();
  }
};

export const SingleRing = {
  name: 'One measure with a caption',
  parameters: { docs: { description: { story: 'A single ring for one progress measure, such as how far readers get through an essay on average.' } } },
  render: SingleRingExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Average read completion')
};

export const Coloured = {
  name: 'Custom colours per ring',
  parameters: { docs: { description: { story: '`colors` picks the ring colours from the chart palette tokens, for a release checklist where each ring is a track of work.' } } },
  render: ColouredExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Release readiness by track')
};
