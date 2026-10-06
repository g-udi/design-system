import { RadialBarChart } from '@gaudi/design-system/charts/RadialChart';
import { stateData, forcedState } from '../../../stories/chartExamples.js';

const goals = [
  { label: 'Essays published', value: 75 },
  { label: 'Newsletter growth', value: 62 },
  { label: 'Talks given', value: 40 }
];

export const PlaygroundExample = ({ state, ...args }) => <RadialBarChart {...args} ariaLabel='Progress towards each goal' data={stateData(state, goals)} state={forcedState(state)} />;

export const SingleRingExample = () => (
    <div className='w-full max-w-xs'>
      <RadialBarChart title='Read completion' description='Average share of the essay read.' ariaLabel='Average read completion' data={[{ label: 'Read completion', value: 78 }]} height={220} />
    </div>
  );

export const ColouredExample = () => (
    <RadialBarChart
      title='Release 2.0 readiness'
      ariaLabel='Release readiness by track'
      data={[{ label: 'Docs', value: 90 }, { label: 'Tests', value: 74 }, { label: 'Migration', value: 48 }]}
      colors={[ 'var(--ds-color-chart-positive)', 'var(--ds-color-chart-3)', 'var(--ds-color-warning)' ]}
      height={260}
    />
  );
