import { expect, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { BarChart, Chart, DonutChart, RadialBarChart, ScatterChart } from './Chart';

const docs = getComponentDocs('MDX/Chart');
const trafficData = [
  { label: 'Mon', readTime: 6, subscribers: 8, views: 124 },
  { label: 'Tue', readTime: 8, subscribers: 12, views: 168 },
  { label: 'Wed', readTime: 7, subscribers: 10, views: 141 },
  { label: 'Thu', readTime: 11, subscribers: 16, views: 226 },
  { label: 'Fri', readTime: 9, subscribers: 14, views: 194 },
  { label: 'Sat', readTime: 12, subscribers: 18, views: 248 }
];

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
    type: ['bar', 'line', 'area', 'composed'],
    yKey: ['views', 'subscribers', 'readTime'],
    title: 'text',
    description: 'text',
    ariaLabel: 'text',
    height: 'number',
    showGrid: 'boolean',
    showLegend: 'boolean',
    showTooltip: 'boolean'
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
    data: trafficData,
    yKey: 'views',
    title: 'Article views',
    description: 'Daily views for the latest article.',
    ariaLabel: 'Article views by day',
    height: 320,
    showGrid: true,
    showLegend: false,
    showTooltip: true
  },
  parameters: { docs: { source: playgroundSource('Chart', { imports: "import { Chart } from '@gaudi/design-system/mdx';" }) } },
  render: (args) => <Chart {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(args.title)).toBeVisible();
    await expect(canvas.getByText(args.description)).toBeVisible();
    await expectChart(canvasElement, args.ariaLabel);
  }
};

export const MultipleSeries = {
  parameters: { docs: { description: { story: '`series` plots several keys on one axis. Add `showLegend` so readers can tell the series apart.' } } },
  render: () => (
    <BarChart
      ariaLabel='Subscribers and read time by day'
      data={trafficData}
      title='Subscribers and read time'
      series={[{ key: 'subscribers', label: 'Subscribers' }, { key: 'readTime', label: 'Read time (min)' }]}
      showLegend
    />
  ),
  play: async ({ canvasElement }) => {
    await expectChart(canvasElement, 'Subscribers and read time by day');
    await waitFor(() => expect(within(canvasElement).getByText('Read time (min)')).toBeVisible());
  }
};

export const PartsOfWhole = {
  parameters: { docs: { description: { story: '`DonutChart` and `PieChart` read `label` and `value` from each record. Keep them to a few slices.' } } },
  render: () => (
    <DonutChart
      ariaLabel='Content mix by category'
      title='Content mix'
      data={[
        { label: 'Data', value: 42 },
        { label: 'Engineering', value: 28 },
        { label: 'Productivity', value: 18 },
        { label: 'Management', value: 12 }
      ]}
    />
  ),
  play: async ({ canvasElement }) => expectChart(canvasElement, 'Content mix by category')
};

export const Scatter = {
  parameters: { docs: { description: { story: '`ScatterChart` plots two numeric fields, set with `xKey` and `yKey`, to show correlation.' } } },
  render: () => (
    <ScatterChart
      ariaLabel='Post length against read time'
      title='Post length and read time'
      data={[
        { words: 800, minutes: 4 },
        { words: 1500, minutes: 8 },
        { words: 2600, minutes: 14 },
        { words: 3400, minutes: 17 },
        { words: 4200, minutes: 22 }
      ]}
      xKey='words'
      yKey='minutes'
    />
  ),
  play: async ({ canvasElement }) => expectChart(canvasElement, 'Post length against read time')
};

export const Radial = {
  parameters: { docs: { description: { story: '`RadialBarChart` shows one compact progress measure against a full track.' } } },
  render: () => <RadialBarChart ariaLabel='Read completion progress' title='Read completion' data={[{ label: 'Read completion', value: 78 }]} />,
  play: async ({ canvasElement }) => expectChart(canvasElement, 'Read completion progress')
};
