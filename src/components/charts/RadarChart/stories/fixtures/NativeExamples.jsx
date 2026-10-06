import { RadarChart } from '@gaudi/design-system/charts/RadarChart';
import { stateData, forcedState } from '../../../stories/chartExamples.js';

const review = [
  { label: 'Clarity', draft: 72, target: 85 },
  { label: 'Structure', draft: 81, target: 80 },
  { label: 'Evidence', draft: 58, target: 75 },
  { label: 'Voice', draft: 88, target: 80 },
  { label: 'Length', draft: 64, target: 70 },
  { label: 'Accessibility', draft: 76, target: 90 }
];

const frameworks = [
  { label: 'Performance', astro: 92, next: 81, remix: 84 },
  { label: 'Ecosystem', astro: 68, next: 94, remix: 72 },
  { label: 'DX', astro: 86, next: 82, remix: 80 },
  { label: 'Hosting', astro: 88, next: 85, remix: 76 },
  { label: 'Content', astro: 95, next: 74, remix: 66 }
];

export const PlaygroundExample = ({ state, ...args }) => (
    <RadarChart
      {...args}
      ariaLabel='Draft scores against the target'
      data={stateData(state, review)}
      series={[{ key: 'draft', label: 'Draft' }, { key: 'target', label: 'Target', dashed: true }]}
      domain={[ 0, 100 ]}
      state={forcedState(state)}
    />
  );

export const ComparisonExample = () => (
    <RadarChart
      title='Choosing a framework for the blog'
      ariaLabel='Framework scores by criterion'
      data={frameworks}
      series={[{ key: 'astro', label: 'Astro' }, { key: 'next', label: 'Next.js' }, { key: 'remix', label: 'Remix' }]}
      filled={false}
      domain={[ 0, 100 ]}
    />
  );

export const SingleExample = () => (
    <RadarChart
      title='Team skills'
      ariaLabel='Team skills profile'
      data={[{ label: 'Design', value: 7 }, { label: 'Frontend', value: 9 }, { label: 'Backend', value: 6 }, { label: 'Data', value: 5 }, { label: 'Writing', value: 8 }]}
      domain={[ 0, 10 ]}
      showRings={false}
      showLegend={false}
      height={280}
    />
  );
