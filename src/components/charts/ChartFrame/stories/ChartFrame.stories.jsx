import { PlaygroundExample, PrimitivesExample, ToolbarExample, DataTableExample, goalPoints, GoalBars } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';

import { createRoot } from 'react-dom/client';

import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { BarChart } from '../../BarChart/index.js';
import { HeatmapChart } from '../../HeatmapChart/index.js';
import { StackedBarList } from '../../StackedBarList/index.js';
import { chartsMeta, focusPlot, readout, ready } from '../../stories/story-helpers.jsx';
import { ChartContainer, ChartFrame, ChartLegendContent, ChartTooltipContent, ChartTooltipRows } from '../index.js';

async function checkChangingChartData(canvasElement) {
  const host = canvasElement.ownerDocument.createElement('div');
  host.style.width = '280px';
  host.style.maxWidth = '100%';
  canvasElement.append(host);
  const root = createRoot(host);
  const canvas = within(host);
  const onActiveChange = fn();
  const props = { ariaLabel: 'Changing chart data', onActiveChange, height: 160 };
  try {
    root.render(<ChartFrame {...props} points={goalPoints}><GoalBars /></ChartFrame>);
    const plot = await canvas.findByRole('group', { name: props.ariaLabel });
    plot.focus();
    await userEvent.keyboard('{End}');
    await expect(onActiveChange).toHaveBeenLastCalledWith(2);
    root.render(<ChartFrame {...props} points={goalPoints.slice(0, 1)}><GoalBars /></ChartFrame>);
    await waitFor(() => expect(onActiveChange).toHaveBeenLastCalledWith(null));
    await expect(plot).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(onActiveChange).toHaveBeenLastCalledWith(0);
    root.render(<ChartFrame {...props} points={goalPoints} status='error' />);
    await waitFor(() => expect(onActiveChange).toHaveBeenLastCalledWith(null));
    await expect(plot).toHaveAttribute('tabindex', '-1');

    const identifier = 'FederatedKnowledgeGraphReconciliationAndContextualEntityResolutionPipeline';
    root.render(<BarChart data={[{ label: 'Recorded zero', value: 0 }, { label: 'Recorded five', value: 5 }]} series={[{ key: 'value', label: identifier }]} showLegend height={240} />);
    await waitFor(() => {
      const legend = host.querySelector('.recharts-legend-wrapper');
      expect(legend).not.toBeNull();
      expect(legend.clientWidth).toBeGreaterThan(0);
      const bounds = legend.getBoundingClientRect();
      for (const label of legend.querySelectorAll('.recharts-legend-item-text')) {
        const range = host.ownerDocument.createRange();
        range.selectNodeContents(label);
        for (const rect of range.getClientRects()) {
          expect(rect.left).toBeGreaterThanOrEqual(bounds.left - 1);
          expect(rect.right).toBeLessThanOrEqual(bounds.right + 1);
        }
      }
    });
    root.render(<StackedBarList title='Long series labels' data={[{ label: 'Recorded zero', a: 0, b: 0 }]} series={[{ key: 'a', label: identifier }, { key: 'b', label: 'Other' }]} normalize />);
    await waitFor(() => {
      const legend = host.querySelector('ul');
      expect(legend).not.toBeNull();
      expect(legend.scrollWidth).toBeLessThanOrEqual(legend.clientWidth + 1);
    });
    await expect(canvas.getByText('0%')).toBeVisible();
    root.render(<HeatmapChart ariaLabel='Long row labels' data={[{ x: 'Mon', y: identifier, value: 2 }, { x: 'Tue', y: identifier, value: 3 }]} />);
    const heatmap = await canvas.findByRole('group', { name: 'Long row labels' });
    heatmap.focus();
    await userEvent.keyboard('{Home}');
    await waitFor(() => {
      expect(heatmap.scrollWidth).toBeLessThanOrEqual(heatmap.clientWidth + 1);
      const label = host.querySelector('[data-slot="chart-readout"]');
      expect(label).toHaveTextContent(identifier);
      expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth + 1);
    });
    root.render(<ChartTooltipRows title={identifier} rows={[{ label: identifier, value: 0 }]} />);
    await waitFor(() => {
      const tooltip = host.querySelector('[data-slot="chart-tooltip"]');
      expect(tooltip).not.toBeNull();
      expect(tooltip.scrollWidth).toBeLessThanOrEqual(tooltip.clientWidth + 1);
    });
    const config = { value: { label: identifier, color: 'var(--ds-color-chart-1)' } };
    root.render(<ChartContainer config={config} className='h-24 w-full'><ChartLegendContent payload={[{ dataKey: 'value', color: 'var(--ds-color-chart-1)' }]} /></ChartContainer>);
    await waitFor(() => {
      const label = canvas.getByText(identifier);
      const bounds = host.getBoundingClientRect();
      const range = host.ownerDocument.createRange();
      range.selectNodeContents(label);
      for (const rect of range.getClientRects()) {
        expect(rect.left).toBeGreaterThanOrEqual(bounds.left - 1);
        expect(rect.right).toBeLessThanOrEqual(bounds.right + 1);
      }
    });
    root.render(<ChartContainer config={config} className='h-32 w-full'><ChartTooltipContent active label={0} payload={[{ dataKey: 'value', name: 'value', value: 0 }]} /></ChartContainer>);
    await waitFor(() => {
      const tooltip = host.querySelector('.ds-part-chart-tooltip');
      expect(tooltip).not.toBeNull();
      expect(tooltip.scrollWidth).toBeLessThanOrEqual(tooltip.clientWidth + 1);
      expect(within(tooltip).getAllByText('0')).toHaveLength(2);
    });
  } finally {
    root.unmount();
    host.remove();
  }
}

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/ChartFrame',
  id: 'charts-chartframe',
  tags: ['autodocs'],
  ...chartsMeta('ChartFrame', { component: ChartFrame, controls: { framed: 'boolean' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Writing goals', description: 'Progress towards this year’s targets.', height: 140, framed: true, showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'The frame every chart renders in, around a custom visual. It supplies the caption, one keyboard stop with a readout, the data table built from `points`, the loading, empty, invalid and error states, and locale formatting. Mark drawn elements with `data-chart-index` and read `useChartFrame().activeIndex` to highlight the active point.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await checkChangingChartData(canvasElement);
    await focusPlot(canvasElement, 'Progress towards writing goals');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Essays: Done 18, Target 24, Progress 75%'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Notes:/));
  }
};

export const Primitives = {
  name: 'Recharts with Gaudi primitives',
  parameters: { docs: { description: { story: 'A bespoke Recharts chart styled by Gaudi: ChartContainer maps a config to the palette, and ChartGrid, ChartXAxis, ChartYAxis and ChartReferenceLine draw with chart tokens. Wrap it in ChartFrame when it needs the keyboard model and the data table.' } } },
  render: PrimitivesExample,
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelectorAll('.recharts-bar-rectangle').length).toBe(5));
  }
};

export const Toolbar = {
  name: 'Controls in the caption',
  parameters: { docs: { description: { story: '`toolbar` places controls beside the caption, next to the Show data toggle; here a period switch that swaps the data.' } } },
  render: ToolbarExample,
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Article views per day');
    await userEvent.click(within(canvasElement).getByRole('radio', { name: 'This month' }));
    await ready(canvasElement, 'Article views per week');
  }
};

export const DataTable = {
  name: 'Data table on its own',
  parameters: { docs: { description: { story: 'ChartDataTable renders the same table a chart mirrors, for a print view or an appendix. `createChartFormatter` gives it the chart’s number format.' } } },
  render: DataTableExample,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('rowheader', { name: 'Talks' })).toBeVisible();
    await expect(within(canvasElement).getByRole('cell', { name: '50%' })).toBeVisible();
  }
};
