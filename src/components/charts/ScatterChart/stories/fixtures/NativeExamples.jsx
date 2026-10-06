import { ScatterChart, BubbleChart } from '@gaudi/design-system/charts/ScatterChart';
import { stateData, forcedState } from '../../../stories/chartExamples.js';

const essays = [
  { label: 'Notes on local-first software', words: 3400, minutes: 14.2 },
  { label: 'Small tools, long lifetimes', words: 1500, minutes: 7.1 },
  { label: 'Designing for real data', words: 2600, minutes: 11.4 },
  { label: 'A practical guide to knowledge graphs', words: 4200, minutes: 12.6 },
  { label: 'Running a calm team', words: 1900, minutes: 8.8 },
  { label: 'Writing that survives a reorg', words: 1200, minutes: 5.4 },
  { label: 'Working from Lisbon', words: 900, minutes: 3.9 }
];

const pages = [
  { label: 'Home', loadTime: 1.2, conversion: 4.8, sessions: 18200 },
  { label: 'Pricing', loadTime: 1.6, conversion: 6.1, sessions: 7400 },
  { label: 'Docs', loadTime: 2.4, conversion: 2.2, sessions: 12600 },
  { label: 'Blog', loadTime: 2.9, conversion: 1.4, sessions: 21400 },
  { label: 'Changelog', loadTime: 1.1, conversion: 3.3, sessions: 2900 },
  { label: 'Signup', loadTime: 3.6, conversion: 2.9, sessions: 5100 }
];

export const PlaygroundExample = ({ state, ...args }) => (
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
  );

export const WithReferencesExample = () => (
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
  );

export const BubblesExample = () => (
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
  );
