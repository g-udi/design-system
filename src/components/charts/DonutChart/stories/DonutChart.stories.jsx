import { PlaygroundExample, PieExample, ControlledExample, plans } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { chartExampleSource } from '../../stories/chartExamples.js';

import { createRoot } from 'react-dom/client';

import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { chartsMeta, focusPlot, ready } from '../../stories/story-helpers.jsx';
import { DonutChart } from '../index.js';

const exampleSource = chartExampleSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Charts/DonutChart',
  id: 'charts-donutchart',
  tags: ['autodocs'],
  ...chartsMeta('DonutChart', { component: DonutChart, controls: { otherThreshold: 'number', selectable: 'boolean', showLegend: 'boolean', centerLabel: 'text' }, primary: () => Playground, source: exampleSource })
};

export const Playground = {
  args: { title: 'Where readers came from', description: 'Sessions this month by source.', height: 320, otherThreshold: 0.03, selectable: true, showLegend: true, centerLabel: 'Sessions', showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'A donut with a centre summary: the total, or the selected slice and its share. `otherThreshold` folds sources under 3% into Other (the data table lists what it holds), and selection pins a slice on click, Enter or Space.' },
      source: { code: exampleSource }
    }
  },
  render: PlaygroundExample,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await ready(canvasElement, 'Sessions by source this month');
    await expect(within(canvasElement).getAllByText('Other').length).toBeGreaterThan(0);
    await waitFor(() => {
      const center = canvasElement.querySelector('[data-slot="chart-center"]').getBoundingClientRect();
      const sectors = [...canvasElement.querySelectorAll('.recharts-sector')].map((node) => node.getBoundingClientRect());
      const cy = (Math.min(...sectors.map((rect) => rect.top)) + Math.max(...sectors.map((rect) => rect.bottom))) / 2;
      expect(Math.abs(center.top + center.height / 2 - cy)).toBeLessThan(2);
    });
  }
};

export const Pie = {
  name: 'Pie for a few parts',
  parameters: { docs: { description: { story: 'A full pie (PieChart) for three plans. Keep pies to a handful of slices; beyond that, a bar list compares more easily.' } } },
  render: PieExample,
  play: async ({ canvasElement }) => ready(canvasElement, 'Workspaces by plan')
};

async function checkRemovedSlice(canvasElement) {
  const host = canvasElement.ownerDocument.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  const onSelect = fn();
  const render = (data, selectedIndex) => root.render(<DonutChart ariaLabel='Changing slices' data={data} selectedIndex={selectedIndex} onSelect={onSelect} height={180} />);
  try {
    render(plans);
    const plot = await focusPlot(host, 'Changing slices');
    await userEvent.keyboard('{End}{Enter}');
    await expect(onSelect).toHaveBeenLastCalledWith(plans[2], 2);
    render(plans.slice(0, 1));
    await waitFor(() => expect(onSelect).toHaveBeenLastCalledWith(null, null));
    await expect(plot).toHaveFocus();
    await waitFor(() => expect(host.querySelector('.recharts-sector')).toHaveAttribute('fill-opacity', '1'));
    render(plans.slice(0, 1), 2);
    await waitFor(() => expect(host.querySelector('.recharts-sector')).toHaveAttribute('fill-opacity', '1'));
    render(plans, 2);
    await waitFor(() => expect(host.querySelector('[data-slot="chart-center"]')).toHaveTextContent('Pro'));
    await expect(onSelect).toHaveBeenCalledTimes(2);
  } finally {
    root.unmount();
    host.remove();
  }
}

export const Controlled = {
  name: 'Controlled selection with a detail panel',
  parameters: { docs: { description: { story: '`selectedIndex` and `onSelect` keep the selection in host state, so a panel beside the chart can describe the slice and clear it.' } } },
  render: ControlledExample,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await focusPlot(canvasElement, 'Workspaces by plan, selectable');
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await waitFor(() => expect(canvas.getByTestId('plan-detail')).toHaveTextContent('Team plan'));
    await userEvent.click(canvas.getByRole('button', { name: 'Clear selection' }));
    await waitFor(() => expect(canvas.getByTestId('plan-detail')).toHaveTextContent('All plans'));
    await checkRemovedSlice(canvasElement);
  }
};
