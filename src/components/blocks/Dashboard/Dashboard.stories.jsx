import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { StatCard } from '../StatCard/StatCard.jsx';
import { AreaChart } from '../../charts/AreaChart/index.js';
import { BarChart } from '../../charts/BarChart/index.js';
import { DashboardGrid, DashboardPanel, DashboardToolbar, dashboardSpan } from './index.js';

const docs = getComponentDocs('Blocks/Dashboard');
const today = new Date(2026, 9, 1);
const readers = ['Sep 4', 'Sep 8', 'Sep 12', 'Sep 16', 'Sep 20', 'Sep 24', 'Sep 28', 'Oct 1'].map((label, index) => ({ label, search: 2100 + index * 120, newsletter: 1500 + index * 80 }));
const sources = [
  { label: 'Search', value: 46 },
  { label: 'Newsletter', value: 31 },
  { label: 'Social', value: 14 },
  { label: 'Direct', value: 9 }
];
const layouts = { balanced: [6, 6], focus: [8, 4], stacked: [12, 12] };

const source = `import { DashboardGrid, DashboardPanel, DashboardToolbar, dashboardSpan } from '@gaudi/design-system/blocks/Dashboard';
import { StatCard } from '@gaudi/design-system/blocks/StatCard';
import { AreaChart, BarChart } from '@gaudi/design-system/charts';

<DashboardToolbar defaultPeriod='30d' defaultCompare onChange={(period) => load(period)} />
<DashboardGrid label='Reading overview'>
  <StatCard label='Readers' value='48.2k' delta='+12%' className={dashboardSpan(3)} />
  {/* … three more cards … */}
  <DashboardPanel title='Readers by channel' span={8}>
    <AreaChart framed={false} data={readers} stacked series={series} />
  </DashboardPanel>
  <DashboardPanel title='Traffic sources' span={4}>
    <BarChart framed={false} data={sources} layout='horizontal' />
  </DashboardPanel>
</DashboardGrid>`;

export default {
  title: 'Blocks/Dashboard',
  id: 'blocks-dashboard',
  component: DashboardGrid,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    period: ['7d', '30d', '90d', '12m'],
    compare: 'boolean',
    layout: Object.keys(layouts),
    showDescriptions: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { period: '30d', compare: true, layout: 'focus', showDescriptions: true },
  parameters: {
    docs: {
      description: { story: 'A reading dashboard: the toolbar sets the period and comparison, and the grid reflows by its own width, twelve columns wide, six in a narrower container and one on a phone. `layout` changes how the two panels share the row, through their `span`.' },
      source: { code: source, language: 'jsx' }
    }
  },
  render: ({ period, compare, layout, showDescriptions }) => {
    const [main, side] = layouts[layout];
    return (
      <div className='grid w-full gap-4'>
        <DashboardToolbar key={`${period}-${compare}`} today={today} defaultPeriod={period} defaultCompare={compare} />
        <DashboardGrid label='Reading overview'>
          <StatCard label='Readers' value='48.2k' delta='+12%' description={showDescriptions ? 'Unique readers' : undefined} className={dashboardSpan(3)} />
          <StatCard label='Read time' value='4m 38s' delta='+6%' description={showDescriptions ? 'Median per article' : undefined} className={dashboardSpan(3)} />
          <StatCard label='Signups' value='1,284' delta='+8%' description={showDescriptions ? 'Newsletter' : undefined} className={dashboardSpan(3)} />
          <StatCard label='Bounce' value='38.6%' delta='+4.1 pts' invert description={showDescriptions ? 'Single-page visits' : undefined} className={dashboardSpan(3)} />
          <DashboardPanel span={main} title='Readers by channel' description={showDescriptions ? 'Search and newsletter, this month' : undefined}>
            <AreaChart framed={false} ariaLabel='Readers by channel' data={readers} stacked showLegend height={220} series={[{ key: 'search', label: 'Search' }, { key: 'newsletter', label: 'Newsletter' }]} />
          </DashboardPanel>
          <DashboardPanel span={side} title='Traffic sources' description={showDescriptions ? 'Share of visits' : undefined}>
            <BarChart framed={false} ariaLabel='Share of visits by source' data={sources} layout='horizontal' height={220} formatValue={(value) => `${value}%`} />
          </DashboardPanel>
        </DashboardGrid>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Reading overview' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('radio', { name: 'Last 7 days' }));
    await waitFor(() => expect(canvas.getByText(/^Showing Sep 25, 2026 – Oct 1, 2026/)).toBeInTheDocument());
  }
};

export const PeriodToolbar = {
  name: 'Period toolbar with a custom range',
  parameters: { docs: { description: { story: 'Presets, a custom range from the calendar and the comparison switch. `onChange` receives the resolved dates and the previous period, ready for a query; the summary line is announced when it changes.' } } },
  render: () => <DashboardToolbar today={today} defaultPeriod='7d' />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Pick a date range' }));
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).getByRole('grid')).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await userEvent.click(canvas.getByRole('switch', { name: /Compare/ }));
    await waitFor(() => expect(canvas.getByText(/compared with Sep 18, 2026 – Sep 24, 2026/)).toBeInTheDocument());
  }
};
