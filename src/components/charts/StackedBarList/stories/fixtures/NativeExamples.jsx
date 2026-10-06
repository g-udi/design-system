import { StackedBarList } from '@gaudi/design-system/charts/StackedBarList';
import { stateData, forcedState } from '../../../stories/chartExamples.js';

const teams = [
  { label: 'Editor', open: 18, review: 7, done: 42 },
  { label: 'Publishing', open: 9, review: 4, done: 31 },
  { label: 'Search', open: 14, review: 2, done: 19 },
  { label: 'Billing', open: 5, review: 3, done: 27 },
  { label: 'Design system', open: 11, review: 9, done: 54 }
];

const statuses = [
  { key: 'open', label: 'Open' },
  { key: 'review', label: 'In review' },
  { key: 'done', label: 'Done' }
];

export const PlaygroundExample = ({ state, ...args }) => <StackedBarList {...args} ariaLabel='Issues per team by status' data={stateData(state, teams)} series={statuses} state={forcedState(state)} />;

export const SingleValueExample = () => (
    <StackedBarList
      title='Top referrers'
      ariaLabel='Sessions by referrer'
      data={[{ label: 'news.ycombinator.com', value: 3420 }, { label: 'lobste.rs', value: 1180 }, { label: 'github.com', value: 960 }, { label: 'mastodon.social', value: 640 }, { label: 'reddit.com', value: 410 }]}
      showLegend={false}
    />
  );

export const NormalisedExample = () => (
    <StackedBarList
      title='Device mix by post'
      ariaLabel='Readers per post by device, as shares'
      data={[{ label: 'Notes on local-first software', desktop: 5200, mobile: 2800, tablet: 420 }, { label: 'Working from Lisbon', desktop: 380, mobile: 1240, tablet: 110 }, { label: 'Designing for real data', desktop: 3100, mobile: 1650, tablet: 520 }]}
      series={[{ key: 'desktop', label: 'Desktop' }, { key: 'mobile', label: 'Mobile' }, { key: 'tablet', label: 'Tablet' }]}
      normalize
    />
  );
