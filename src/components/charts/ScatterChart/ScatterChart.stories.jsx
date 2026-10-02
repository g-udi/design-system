import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chartsMeta, forcedState, focusPlot, readout, ready, stateData } from '../story-helpers.jsx';
import { BubbleChart, ScatterChart } from './index.js';

// Essays by length and average minutes read.
const essays = [
  { label: 'Notes on local-first software', words: 3400, minutes: 14.2 },
  { label: 'Small tools, long lifetimes', words: 1500, minutes: 7.1 },
  { label: 'Designing for real data', words: 2600, minutes: 11.4 },
  { label: 'A practical guide to knowledge graphs', words: 4200, minutes: 12.6 },
  { label: 'Running a calm team', words: 1900, minutes: 8.8 },
  { label: 'Writing that survives a reorg', words: 1200, minutes: 5.4 },
  { label: 'Working from Lisbon', words: 900, minutes: 3.9 }
];

export default {
  title: 'Charts/ScatterChart',
  id: 'charts-scatterchart',
  tags: ['autodocs'],
  ...chartsMeta('ScatterChart', { component: ScatterChart, controls: { showGrid: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Length and reading time', description: 'Each essay by word count and the minutes readers spend on it.', height: 300, showGrid: true, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'Correlation between two numbers. Points may carry a `label`, which names them in the readout, tooltip and table. The arrow keys move from point to point.' },
      source: {
        language: 'jsx',
        code: `import { ScatterChart } from '@gaudi/design-system/charts';

<ScatterChart
  title='Length and reading time'
  ariaLabel='Essay length against minutes read'
  data={essays}
  xKey='words'
  xLabel='Words'
  yKey='minutes'
  yLabel='Minutes'
/>`
      }
    }
  },
  render: ({ state, ...args }) => (
    <ScatterChart
      {...args}
      ariaLabel='Essay length against minutes read'
      data={state === 'invalid' ? [{ words: 'n/a', minutes: 3 }] : stateData(state, essays)}
      xKey='words'
      xLabel='Words'
      yKey='minutes'
      yLabel='Minutes'
      state={forcedState(state)}
    />
  ),
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await focusPlot(canvasElement, 'Essay length against minutes read');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Notes on local-first software: Words 3,400/));
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Small tools, long lifetimes/));
  }
};

export const WithReferences = {
  name: 'Quadrants with reference lines',
  parameters: { docs: { description: { story: 'Average lines on both axes split the essays into quadrants: long and well read, long and skimmed, and so on.' } } },
  render: () => (
    <ScatterChart
      title='Which long essays get read?'
      ariaLabel='Essay length against minutes read, with averages'
      data={essays}
      xKey='words'
      xLabel='Words'
      yKey='minutes'
      yLabel='Minutes'
      references={[{ x: 2243, label: 'Average length' }, { y: 9.1, label: 'Average minutes' }]}
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Essay length against minutes read, with averages')
};

// Pages by load time, conversion and traffic (bubble size).
const pages = [
  { label: 'Home', loadTime: 1.2, conversion: 4.8, sessions: 18200 },
  { label: 'Pricing', loadTime: 1.6, conversion: 6.1, sessions: 7400 },
  { label: 'Docs', loadTime: 2.4, conversion: 2.2, sessions: 12600 },
  { label: 'Blog', loadTime: 2.9, conversion: 1.4, sessions: 21400 },
  { label: 'Changelog', loadTime: 1.1, conversion: 3.3, sessions: 2900 },
  { label: 'Signup', loadTime: 3.6, conversion: 2.9, sessions: 5100 }
];

export const Bubbles = {
  name: 'Bubbles sized by traffic',
  parameters: { docs: { description: { story: 'BubbleChart: load time against conversion, with sessions as the bubble area. Slow, busy pages stand out as large bubbles to the right.' } } },
  render: () => (
    <BubbleChart
      title='Slow pages convert less'
      ariaLabel='Load time against conversion, sized by sessions'
      data={pages}
      xKey='loadTime'
      xLabel='Load time (s)'
      yKey='conversion'
      yLabel='Conversion %'
      zKey='sessions'
      zLabel='Sessions'
    />
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Load time against conversion, sized by sessions');
    await expect(within(canvasElement).getByRole('rowheader', { name: 'Changelog' })).toBeInTheDocument();
  }
};
