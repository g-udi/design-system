import { BarChart } from '@gaudi/design-system/charts/BarChart';
import { stateData, forcedState } from '../../../stories/chartExamples.js';
import { useState } from 'react';

export const readers = [
  { label: 'Jan', search: 1840, newsletter: 920, social: 610 },
  { label: 'Feb', search: 2110, newsletter: 1040, social: 480 },
  { label: 'Mar', search: 2380, newsletter: 1180, social: 1320 },
  { label: 'Apr', search: 2260, newsletter: 1310, social: 760 },
  { label: 'May', search: 2790, newsletter: 1460, social: 890 },
  { label: 'Jun', search: 3120, newsletter: 1620, social: 1040 }
];

const channels = [
  { key: 'search', label: 'Search' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'social', label: 'Social' }
];

const topPosts = [
  { label: 'Notes on local-first software', reads: 8420 },
  { label: 'Small tools, long lifetimes', reads: 6130 },
  { label: 'Designing for real data', reads: 5270 },
  { label: 'A practical guide to knowledge graphs', reads: 4890 },
  { label: 'Running a calm team', reads: 3310 }
];

const builds = [
  { label: 'W1', install: 42, test: 96, deploy: 18 },
  { label: 'W2', install: 38, test: 104, deploy: 21 },
  { label: 'W3', install: 35, test: 88, deploy: 19 },
  { label: 'W4', install: 31, test: 72, deploy: 16 },
  { label: 'W5', install: 29, test: 64, deploy: 15 }
];

const releases = [
  { label: 'v1.8', fixes: 14 },
  { label: 'v1.9', fixes: 22 },
  { label: 'v2.0', fixes: 41 },
  { label: 'v2.1', fixes: 17 },
  { label: 'v2.2', fixes: 9 }
];

function HighlightRelease() {
  const [ picked, setPicked ] = useState('v2.0');

  return (
    <div className='grid gap-3'>
      <BarChart
        title='Fixes per release'
        ariaLabel='Bug fixes per release'
        data={releases}
        yKey='fixes'
        highlight={picked}
        onActivate={(point) => setPicked(point.label)}
        height={260}
      />
      <p className='text-sm text-text-muted' data-testid='picked-release'>
        Showing <span className='font-medium text-text'>{picked}</span>. Click a bar, or press Enter on it, to read another release.
      </p>
    </div>
  );
}

export const PlaygroundExample = ({ state, ...args }) => <BarChart {...args} ariaLabel='Monthly readers by channel' data={stateData(state, readers)} series={channels} state={forcedState(state)} />;

export const HorizontalExample = () => (
    <BarChart
      title='Most read this quarter'
      ariaLabel='Reads per post this quarter'
      data={topPosts}
      yKey='reads'
      layout='horizontal'
      height={300}
      references={[{ x: 5604, label: 'Average', tone: 'neutral' }]}
    />
  );

export const StackedExample = () => (
    <BarChart
      title='CI minutes per week'
      description='Install, test and deploy, against the 120-minute budget.'
      ariaLabel='CI minutes per week by stage'
      data={builds}
      series={[{ key: 'install', label: 'Install' }, { key: 'test', label: 'Test' }, { key: 'deploy', label: 'Deploy' }]}
      stacked
      showLegend
      references={[{ y: 120, label: 'Budget', tone: 'warning' }]}
      formatValue={(value) => `${value} min`}
    />
  );

export const HighlightedExample = () => <HighlightRelease />;
