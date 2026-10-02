import { expect, within } from 'storybook/test';
import { chartsMeta, forcedState, ready, stateData } from '../story-helpers.jsx';
import { StackedBarList } from './index.js';

// Issues per team by status.
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

export default {
  title: 'Charts/StackedBarList',
  id: 'charts-stackedbarlist',
  tags: ['autodocs'],
  ...chartsMeta('StackedBarList', { component: StackedBarList, controls: { normalize: 'boolean', sort: 'boolean', showLegend: 'boolean' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Issues by team', description: 'Open, in review and done this cycle.', normalize: false, sort: true, showLegend: true, showData: 'hidden', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'One row per team, segments per status. `normalize` draws each row as 100% to compare mixes; `sort` puts the largest row first. The chart grows with its rows, so it suits long ranked lists.' },
      source: {
        language: 'jsx',
        code: `import { StackedBarList } from '@gaudi/design-system/charts';

<StackedBarList
  title='Issues by team'
  ariaLabel='Issues per team by status'
  data={teams}
  series={[{ key: 'open', label: 'Open' }, { key: 'review', label: 'In review' }, { key: 'done', label: 'Done' }]}
/>`
      }
    }
  },
  render: ({ state, ...args }) => <StackedBarList {...args} ariaLabel='Issues per team by status' data={stateData(state, teams)} series={statuses} state={forcedState(state)} />,
  play: async ({ args, canvasElement }) => {
    if (args.state === 'ready') await ready(canvasElement, 'Issues per team by status');
  }
};

export const SingleValue = {
  name: 'Ranked list with one value',
  parameters: { docs: { description: { story: 'Without `series`, each row is one bar of `valueKey`: the top referrers to the blog, ranked.' } } },
  render: () => (
    <StackedBarList
      title='Top referrers'
      ariaLabel='Sessions by referrer'
      data={[{ label: 'news.ycombinator.com', value: 3420 }, { label: 'lobste.rs', value: 1180 }, { label: 'github.com', value: 960 }, { label: 'mastodon.social', value: 640 }, { label: 'reddit.com', value: 410 }]}
      showLegend={false}
    />
  ),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Sessions by referrer');
    await expect(within(canvasElement).getAllByText('lobste.rs')[0]).toBeVisible();
  }
};

export const Normalised = {
  name: 'Compare mixes as 100%',
  parameters: { docs: { description: { story: 'Device mix per post with `normalize`, so a post with few readers still shows its shape next to the most-read one.' } } },
  render: () => (
    <StackedBarList
      title='Device mix by post'
      ariaLabel='Readers per post by device, as shares'
      data={[{ label: 'Notes on local-first software', desktop: 5200, mobile: 2800, tablet: 420 }, { label: 'Working from Lisbon', desktop: 380, mobile: 1240, tablet: 110 }, { label: 'Designing for real data', desktop: 3100, mobile: 1650, tablet: 520 }]}
      series={[{ key: 'desktop', label: 'Desktop' }, { key: 'mobile', label: 'Mobile' }, { key: 'tablet', label: 'Tablet' }]}
      normalize
    />
  ),
  play: async ({ canvasElement }) => ready(canvasElement, 'Readers per post by device, as shares')
};
