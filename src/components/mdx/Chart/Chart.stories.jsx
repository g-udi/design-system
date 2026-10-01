import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { CHART_TYPES, Chart, DonutChart, RadialBarChart, ScatterChart } from './Chart';

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
      description: { story: 'An article paragraph and the chart that backs it. `type` switches between every chart, each with data that suits it. Tab to the plot and use the arrow keys to read each point; `showData` reveals the table that mirrors it, `state` previews the loading, empty, invalid and error states, and `locale` reformats every number.' },
      source: playgroundSource('Chart', {
        imports: "import { Chart } from '@gaudi/design-system/mdx';",
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

const shapes = [
  {
    Component: DonutChart,
    note: 'DonutChart and PieChart read label and value; keep them to a few slices.',
    props: {
      ariaLabel: 'Content mix by category',
      title: 'Content mix',
      data: [{ label: 'Data', value: 42 }, { label: 'Engineering', value: 28 }, { label: 'Productivity', value: 18 }, { label: 'Management', value: 12 }]
    }
  },
  {
    Component: ScatterChart,
    note: 'ScatterChart plots the two numeric fields named by xKey and yKey.',
    props: {
      ariaLabel: 'Post length against read time',
      title: 'Length and read time',
      xKey: 'words',
      yKey: 'minutes',
      data: [{ words: 800, minutes: 4 }, { words: 1500, minutes: 8 }, { words: 2600, minutes: 14 }, { words: 3400, minutes: 17 }, { words: 4200, minutes: 22 }]
    }
  },
  {
    Component: RadialBarChart,
    note: 'RadialBarChart shows one progress measure against a full track.',
    props: { ariaLabel: 'Read completion progress', title: 'Read completion', data: [{ label: 'Read completion', value: 78 }] }
  }
];

export const ChartTypes = {
  name: 'Part-to-whole, correlation and progress',
  parameters: { docs: { description: { story: 'The chart types whose data shape differs from the Playground series: a donut for parts of a whole, a scatter for correlation, and a radial bar for one progress measure.' } } },
  render: () => (
    <div className='grid gap-4 sm:grid-cols-3'>
      {shapes.map(({ Component, note, props }) => (
        <figure key={props.ariaLabel} className='min-w-0'>
          <Component {...props} height={220} className='my-0' />
          <figcaption className='mt-2 text-xs leading-5 text-text-muted'>{note}</figcaption>
        </figure>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const { props } of shapes) await expectChart(canvasElement, props.ariaLabel);
  }
};
