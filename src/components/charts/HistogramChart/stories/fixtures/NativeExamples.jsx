import { HistogramChart } from '@gaudi/design-system/charts/HistogramChart';
import { forcedState } from '../../../stories/chartExamples.js';

const weights = [ 180, 210, 240, 260, 280, 290, 310, 320, 330, 340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 470, 480, 500, 520, 540, 560, 580, 600, 620, 650, 680, 700, 740, 780, 820, 860, 900, 960, 1020, 1100, 1180, 1260, 1400, 1520, 1700, 1980, 2400 ];

const sessions = [ 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 5, 6, 8, 9, 10, 11, 11, 12, 12, 12, 13, 13, 14, 14, 15, 16, 18, 22 ];

export const PlaygroundExample = ({ state, ...args }) => (
    <HistogramChart
      {...args}
      ariaLabel='Distribution of page weight across essays'
      values={state === 'empty' ? [] : state === 'invalid' ? [ 'heavy' ] : weights}
      markers={[{ value: 520, label: 'Median' }, { value: 1000, label: 'Budget', tone: 'danger' }]}
      state={forcedState(state)}
    />
  );

export const BimodalExample = () => (
    <HistogramChart
      title='Session length'
      ariaLabel='Distribution of session length in minutes'
      values={sessions}
      bins={8}
      unit=' min'
      markers={[{ value: 2, label: 'Skim' }, { value: 12, label: 'Deep read', tone: 'success' }]}
      height={240}
    />
  );

export const FixedDomainExample = () => (
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
  );
