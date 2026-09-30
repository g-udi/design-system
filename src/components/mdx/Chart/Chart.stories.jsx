import { expect, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { Chart, DonutChart, RadialBarChart, ScatterChart } from './Chart';

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

/** Every chart renders a labelled figure once Recharts has mounted. */
const expectChart = async (canvasElement, ariaLabel) => {
  const canvas = within(canvasElement);
  await expect(canvas.queryByText(/Chart renderer unavailable/)).not.toBeInTheDocument();
  await waitFor(() => expect(canvas.getAllByRole('img', { name: ariaLabel }).length).toBeGreaterThan(1));
};

export default {
  title: 'MDX/Chart',
  id: 'mdx-chart',
  component: Chart,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    type: ['bar', 'line', 'area'],
    title: 'text',
    description: 'text',
    height: 'number',
    showGrid: 'boolean',
    showLegend: 'boolean'
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
  args: {
    type: 'bar',
    title: 'Readers by channel',
    description: 'Monthly unique readers, January to June.',
    height: 280,
    showGrid: true,
    showLegend: true
  },
  parameters: {
    docs: {
      description: { story: 'An article paragraph and the chart that backs it: six months of readers across three channels. Switch `type` to compare the same series as bars, lines, or areas.' },
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
  render: (args) => (
    <div className='text-base leading-7 text-text'>
      <p>{lead}</p>
      <Chart {...args} data={readers} series={series} ariaLabel='Monthly readers by channel' className='mb-0' />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(args.title)).toBeVisible();
    await expect(canvas.getByText(args.description)).toBeVisible();
    await expectChart(canvasElement, 'Monthly readers by channel');
    const legend = () => canvasElement.querySelector('.recharts-legend-wrapper');
    if (args.showLegend) await waitFor(() => expect(within(legend()).getByText('Newsletter')).toBeVisible());
    else await expect(legend()).not.toBeInTheDocument();
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
