import { PlaygroundExample, SingleValueExample, NormalisedExample } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, within } from 'storybook/test';
import { chartsMeta, ready } from '../../stories/story-helpers.jsx';
import { StackedBarList } from '../index.js';

// Issues per team by status.

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/StackedBarList',
  id: 'charts-stackedbarlist',
  tags: ['autodocs'],
  ...chartsMeta('StackedBarList', { component: StackedBarList, controls: { normalize: 'boolean', sort: 'boolean', showLegend: 'boolean' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Issues by team', description: 'Open, in review and done this cycle.', normalize: false, sort: true, showLegend: true, showData: 'hidden', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'One row per team, segments per status. `normalize` draws each row as 100% to compare mixes; `sort` puts the largest row first. The chart grows with its rows, so it suits long ranked lists.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state === 'ready') await ready(canvasElement, 'Issues per team by status');
  }
};

export const SingleValue = {
  name: 'Ranked list with one value',
  parameters: { docs: { description: { story: 'Without `series`, each row is one bar of `valueKey`: the top referrers to the blog, ranked.' } } },
  render: SingleValueExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Sessions by referrer');
    await expect(within(canvasElement).getAllByText('lobste.rs')[0]).toBeVisible();
  }
};

export const Normalised = {
  name: 'Compare mixes as 100%',
  parameters: { docs: { description: { story: 'Device mix per post with `normalize`, so a post with few readers still shows its shape next to the most-read one.' } } },
  render: NormalisedExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Readers per post by device, as shares')
};
