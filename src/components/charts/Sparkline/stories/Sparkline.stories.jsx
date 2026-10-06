import { PlaygroundExample, InTableExample, InlineExample, metrics } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';
import { expect, within } from 'storybook/test';
import { chartsMeta, ready } from '../../stories/story-helpers.jsx';
import { Sparkline } from '../index.js';

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/Sparkline',
  id: 'charts-sparkline',
  tags: ['autodocs'],
  ...chartsMeta('Sparkline', { component: Sparkline, controls: { variant: [ 'line', 'area', 'bar' ], showEndpoint: 'boolean', reference: 'number' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { variant: 'area', showEndpoint: true, reference: 1400, height: 64, showData: 'hidden', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'A word-sized trend without axes: `variant` draws a line, an area or bars, `reference` adds a dashed guide such as a target, and `showEndpoint` marks the latest value. It keeps the full frame: name it with `ariaLabel` and the values stay in the data table.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state === 'ready') await ready(canvasElement, 'Readers, last 14 days');
  }
};

export const InTable = {
  name: 'Trends in a table',
  parameters: { docs: { description: { story: 'One sparkline per row of a metrics table. Each trend is still a named, keyboard-reachable chart, so a screen reader gets the values the eye reads from the shape.' } } },
  render: InTableExample,
  play: async ({ canvasElement }) => {
    for (const metric of metrics) await ready(canvasElement, `${metric.name}, last 14 days`);
  }
};

export const Inline = {
  name: 'Inline in prose',
  parameters: { docs: { description: { story: 'A sparkline sized to a line of text, within article text, so the trend sits right next to the sentence that describes it.' } } },
  render: InlineExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Minutes read per visit, last 8 weeks');
    await expect(within(canvasElement).getByText(/held steady/)).toBeVisible();
  }
};
