import Link from '@gaudi/design-system/core/Link';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { Chart } from '../Chart';
import { CHART_TYPES } from '../chartTypes.js';

const docs = getComponentDocs('MDX/Chart');
// Monthly readers by acquisition channel: three series on one scale, so every type reads well.
const readers = [
  { label: 'Jan', search: 1840, newsletter: 920, social: 610 },
  { label: 'Feb', search: 2110, newsletter: 1040, social: 480 },
  { label: 'Mar', search: 2380, newsletter: 1180, social: 1320 },
  { label: 'Apr', search: 2260, newsletter: 1310, social: 760 },
  { label: 'May', search: 2790, newsletter: 1460, social: 890 },
  { label: 'Jun', search: 3120, newsletter: 1620, social: 1040 }
];
const series = [
  { key: 'search', label: 'Search' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'social', label: 'Social' }
];
const lead = 'Search still brings in most readers, the newsletter has grown every month, and social spiked with the March launch.';

// One realistic data set per type, so the `type` control shows each chart at its best.
const sampleProps = {
  'area': { data: readers, series },
  'bar': { data: readers, series },
  'bar-list': { data: [{ label: 'Notes on local-first software', search: 3120, newsletter: 1460, social: 610 }, { label: 'Small tools, long lifetimes', search: 1840, newsletter: 920, social: 1320 }, { label: 'Designing for real data', search: 2260, newsletter: 610, social: 480 }], series },
  'box-plot': { data: [{ label: 'Home', values: [ 180, 210, 240, 260, 300, 340, 420, 980 ] }, { label: 'Essay', values: [ 220, 260, 300, 330, 380, 450, 520 ] }, { label: 'Search', values: [ 320, 380, 420, 510, 560, 640, 700, 1500 ] }], unit: 'ms' },
  'bubble': { data: [{ label: 'Local-first', x: 2600, y: 14, z: 840 }, { label: 'Small tools', x: 1500, y: 8, z: 320 }, { label: 'Real data', x: 3400, y: 17, z: 1200 }, { label: 'Graphs', x: 4200, y: 22, z: 560 }], xLabel: 'Words', yLabel: 'Minutes', zLabel: 'Shares' },
  'composed': { data: readers.map((item) => ({ label: item.label, readTime: Math.round(item.newsletter / 300), views: item.search })) },
  'donut': { data: [{ label: 'Data', value: 42 }, { label: 'Engineering', value: 28 }, { label: 'Productivity', value: 18 }, { label: 'Management', value: 12 }] },
  'funnel': { data: [{ label: 'Visited a post', value: 12400 }, { label: 'Saw the signup', value: 6100 }, { label: 'Started signup', value: 1480 }, { label: 'Confirmed email', value: 1120 }] },
  'gauge': { bands: [{ to: 50, tone: 'danger' }, { to: 90, tone: 'warning' }, { to: 100, tone: 'success' }], label: 'Performance score', target: 90, value: 84 },
  'heatmap': { data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri' ].flatMap((day, row) => [ '08', '10', '12', '14', '16', '18' ].map((hour, column) => ({ value: ((row + 2) * (column + 3) * 7) % 23, x: `${hour}:00`, y: day }))) },
  'histogram': { markers: [{ label: 'Median', value: 7 }], unit: ' min', values: [ 3, 4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 8, 8, 9, 10, 11, 12, 14, 18, 24 ] },
  'line': { data: readers, series },
  'pie': { data: [{ label: 'Data', value: 42 }, { label: 'Engineering', value: 28 }, { label: 'Productivity', value: 18 }] },
  'radar': { data: [{ label: 'Clarity', value: 72 }, { label: 'Structure', value: 81 }, { label: 'Evidence', value: 58 }, { label: 'Voice', value: 88 }, { label: 'Length', value: 64 }], domain: [ 0, 100 ] },
  'radial': { data: [{ label: 'Read completion', value: 78 }] },
  'range': { data: readers.map((item) => ({ high: item.search * 1.15, label: item.label, low: item.search * 0.85, value: item.search })), bandLabel: 'Forecast', valueLabel: 'Search' },
  'sankey': { links: [{ source: 'Search', target: 'Essays', value: 3120 }, { source: 'Newsletter', target: 'Essays', value: 1460 }, { source: 'Social', target: 'Notes', value: 890 }, { source: 'Essays', target: 'Subscribed', value: 620 }, { source: 'Notes', target: 'Subscribed', value: 140 }] },
  'scatter': { data: [{ x: 800, y: 4 }, { x: 1500, y: 8 }, { x: 2600, y: 14 }, { x: 3400, y: 17 }, { x: 4200, y: 22 }], xLabel: 'Words', yLabel: 'Minutes' },
  'sparkline': { data: readers.map((item) => item.newsletter), height: 64, variant: 'area' },
  'treemap': { data: [{ children: [{ name: 'Essays', value: 48 }, { name: 'Notes', value: 21 }], name: 'Writing' }, { children: [{ name: 'Images', value: 33 }, { name: 'Video', value: 12 }], name: 'Media' }] },
  'waterfall': { data: [{ label: 'January', total: true, value: 3120 }, { label: 'New', value: 840 }, { label: 'Returning', value: 260 }, { label: 'Unsubscribed', value: -410 }, { label: 'February', total: true }] }
};

/** The chart has mounted: a named, ready plot without the renderer fallback. */
const expectChart = async (canvasElement, name) => {
  const canvas = within(canvasElement);
  await waitFor(() => expect(canvas.getByRole('group', { name })).toBeInTheDocument());
  await expect(canvas.getByRole('group', { name }).closest('[data-slot="chart"]')).toHaveAttribute('data-state', 'ready');
};

export default {
  title: 'MDX/Chart',
  id: 'mdx-chart',
  component: Chart,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    type: CHART_TYPES,
    title: 'text',
    description: 'text',
    height: 'number',
    showGrid: 'boolean',
    showLegend: 'boolean',
    showData: [ 'hidden', 'toggle', 'visible' ],
    state: [ 'ready', 'loading', 'empty', 'invalid', 'error' ],
    locale: [ 'en-US', 'de-DE', 'fr-FR', 'ja-JP' ]
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

const stateData = { 'empty': [], 'invalid': [{ label: 'Jan', search: 'n/a' }] };

export const Playground = {
  args: {
    type: 'bar',
    title: 'Readers by channel',
    description: 'Monthly unique readers, January to June.',
    height: 280,
    showGrid: true,
    showLegend: true,
    showData: 'toggle',
    state: 'ready',
    locale: 'en-US'
  },
  parameters: {
    docs: {
      description: { story: 'An article paragraph and the chart that backs it, as an author writes it in MDX. `type` picks any chart from the Charts collection, each shown with data that suits it. Tab to the plot and use the arrow keys to read each point; `showData` reveals the table that mirrors it, `state` previews the loading, empty, invalid and error states, and `locale` reformats every number.' },
      source: playgroundSource('Chart', {
        imports: "// In MDX, Chart comes from the MDX component map; in code, import it from the mdx entry.\nimport { Chart } from '@gaudi/design-system/mdx';",
        before: "const readers = [\n  { label: 'Jan', search: 1840, newsletter: 920, social: 610 },\n  { label: 'Feb', search: 2110, newsletter: 1040, social: 480 }\n  // …one record per month\n];\n\n",
        attributes: [
          'data={readers}',
          "series={[{ key: 'search', label: 'Search' }, { key: 'newsletter', label: 'Newsletter' }, { key: 'social', label: 'Social' }]}",
          "ariaLabel='Monthly readers by channel'"
        ]
      })
    }
  },
  render: ({ state, type, ...args }) => {
    const sample = sampleProps[type] || sampleProps.bar;
    const forced = state === 'loading' || state === 'error' ? state : undefined;
    const data = stateData[state] || sample.data;

    return (
      <div className='text-base leading-7 text-text'>
        <p>{lead}</p>
        <Chart {...args} {...sample} data={data} ariaLabel='Monthly readers by channel' className='mb-0' state={forced} type={type} />
      </div>
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: args.title })).toBeVisible();
    await expect(canvas.getByText(args.description)).toBeVisible();
    if (args.state !== 'ready' || args.type !== 'bar') return;
    await expectChart(canvasElement, 'Monthly readers by channel');
    const legend = () => canvasElement.querySelector('.recharts-legend-wrapper');
    if (args.showLegend) await waitFor(() => expect(within(legend()).getByText('Newsletter')).toBeVisible());
    else await expect(legend()).not.toBeInTheDocument();
    // Keyboard: the plot is one stop, the arrows walk the months and the readout names them.
    const plot = canvas.getByRole('group', { name: 'Monthly readers by channel' });
    plot.focus();
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="chart-readout"]')).toHaveTextContent(/^Jan: Search 1,840/));
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="chart-readout"]')).toHaveTextContent(/^Feb: Search 2,110/));
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="chart-readout"]')).toHaveTextContent(/^Jun:/));
    plot.blur();
    if (args.showData === 'toggle') {
      await userEvent.click(canvas.getByRole('button', { name: 'Show data' }));
      await waitFor(() => expect(canvas.getByRole('table')).toBeVisible());
      await expect(canvas.getByRole('rowheader', { name: 'Mar' })).toBeVisible();
      await userEvent.click(canvas.getByRole('button', { name: 'Hide data' }));
    }
  }
};

const mdxSource = `---
title: 'What changed after the redesign'
---

Search still brings in most readers, and the newsletter has grown every month.

<Chart
  type='line'
  title='Readers by channel'
  ariaLabel='Monthly readers by channel'
  data={[
    { label: 'Jan', search: 1840, newsletter: 920 },
    { label: 'Feb', search: 2110, newsletter: 1040 },
    { label: 'Mar', search: 2380, newsletter: 1180 }
  ]}
  series={[{ key: 'search', label: 'Search' }, { key: 'newsletter', label: 'Newsletter' }]}
/>

Every chart is also available by name, for posts that read better that way:

<DonutChart title='Essays by topic' data={[{ label: 'Data', value: 42 }, { label: 'Engineering', value: 28 }]} />`;

const collection = [
  [ 'Series', [ 'BarChart', 'LineChart', 'AreaChart', 'ComposedChart', 'RangeChart', 'Sparkline' ] ],
  [ 'Change and flow', [ 'WaterfallChart', 'FunnelChart', 'SankeyChart' ] ],
  [ 'Part of a whole', [ 'DonutChart', 'StackedBarList', 'TreemapChart' ] ],
  [ 'Distribution and correlation', [ 'HistogramChart', 'BoxPlotChart', 'ScatterChart' ] ],
  [ 'Readings, scores and grids', [ 'GaugeChart', 'RadialChart', 'RadarChart', 'HeatmapChart' ] ]
];

export const InMdx = {
  name: 'Writing a chart in MDX',
  parameters: {
    docs: {
      description: { story: 'Charts in an article are the Charts collection rendered through the MDX component map: `<Chart type=…>` or a chart by name. Data lives inline in the post (or in frontmatter passed as props), and every chart keeps its keyboard reading and data table. Each type has its own page under Charts with detailed examples.' },
      source: { language: 'mdx', code: mdxSource }
    }
  },
  render: () => (
    <div className='grid gap-4 text-base leading-7 text-text'>
      <p>Search still brings in most readers, and the newsletter has grown every month.</p>
      <Chart
        type='line'
        title='Readers by channel'
        ariaLabel='Monthly readers by channel, in an article'
        data={readers.slice(0, 3)}
        series={series.slice(0, 2)}
        className='my-0'
      />
      <nav aria-label='Charts collection' className='grid gap-2 rounded-lg border border-border bg-surface-muted p-4 text-sm'>
        <span className='font-medium'>Every chart in the collection</span>
        {collection.map(([ group, owners ]) => (
          <p key={group} className='m-0'>
            <span className='text-text-muted'>{group}: </span>
            {owners.map((owner, index) => (
              <span key={owner}>
                {index ? ', ' : ''}
                <Link tone='accent' href={`?path=/docs/charts-${owner.toLowerCase()}--docs`} target='_top'>{owner}</Link>
              </span>
            ))}
          </p>
        ))}
      </nav>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expectChart(canvasElement, 'Monthly readers by channel, in an article');
    await expect(within(canvasElement).getByRole('link', { name: 'SankeyChart' })).toHaveAttribute('href', '?path=/docs/charts-sankeychart--docs');
  }
};
