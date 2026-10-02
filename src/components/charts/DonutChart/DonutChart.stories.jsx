import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { chartsMeta, forcedState, focusPlot, ready, stateData } from '../story-helpers.jsx';
import { DonutChart, PieChart } from './index.js';

const traffic = [
  { label: 'Search', value: 4820 },
  { label: 'Newsletter', value: 2410 },
  { label: 'Social', value: 1360 },
  { label: 'Direct', value: 980 },
  { label: 'Referral', value: 140 },
  { label: 'Podcast', value: 90 }
];

export default {
  title: 'Charts/DonutChart',
  id: 'charts-donutchart',
  tags: ['autodocs'],
  ...chartsMeta('DonutChart', { component: DonutChart, controls: { otherThreshold: 'number', selectable: 'boolean', showLegend: 'boolean', centerLabel: 'text' }, primary: () => Playground })
};

export const Playground = {
  args: { title: 'Where readers came from', description: 'Sessions this month by source.', height: 320, otherThreshold: 0.03, selectable: true, showLegend: true, centerLabel: 'Sessions', showData: 'toggle', state: 'ready', locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: 'A donut with a centre summary: the total, or the selected slice and its share. `otherThreshold` folds sources under 3% into Other (the data table lists what it holds), and selection pins a slice on click, Enter or Space.' },
      source: {
        language: 'jsx',
        code: `import { DonutChart } from '@gaudi/design-system/charts';

<DonutChart
  title='Where readers came from'
  ariaLabel='Sessions by source this month'
  data={traffic}
  otherThreshold={0.03}
  centerLabel='Sessions'
  onSelect={(slice) => setSource(slice?.label)}
/>`
      }
    }
  },
  render: ({ state, ...args }) => <DonutChart {...args} ariaLabel='Sessions by source this month' data={stateData(state, traffic)} state={forcedState(state)} />,
  play: async ({ args, canvasElement }) => {
    if (args.state !== 'ready') return;
    await ready(canvasElement, 'Sessions by source this month');
    await expect(within(canvasElement).getAllByText('Other').length).toBeGreaterThan(0);
  }
};

const plans = [
  { label: 'Free', value: 6200 },
  { label: 'Team', value: 1180 },
  { label: 'Pro', value: 420 }
];

export const Pie = {
  name: 'Pie for a few parts',
  parameters: { docs: { description: { story: 'A full pie (PieChart) for three plans. Keep pies to a handful of slices; beyond that, a bar list compares more easily.' } } },
  render: () => <PieChart title='Workspaces by plan' ariaLabel='Workspaces by plan' data={plans} height={280} />,
  play: async ({ canvasElement }) => ready(canvasElement, 'Workspaces by plan')
};

function ControlledDonut() {
  const [ index, setIndex ] = useState(null);
  const slice = index == null ? null : plans[index];

  return (
    <div className='grid items-center gap-4 sm:grid-cols-[minmax(0,1fr)_14rem]'>
      <DonutChart title='Workspaces by plan' ariaLabel='Workspaces by plan, selectable' data={plans} selectedIndex={index} onSelect={(_, next) => setIndex(next)} centerLabel='Workspaces' height={260} />
      <div className='grid gap-1 text-sm' data-testid='plan-detail'>
        <h3 className='font-semibold'>{slice ? `${slice.label} plan` : 'All plans'}</h3>
        <p className='text-text-muted'>{slice ? `${slice.value.toLocaleString('en-US')} workspaces.` : 'Select a slice to see one plan.'}</p>
        <button type='button' className='justify-self-start text-sm underline underline-offset-4' onClick={() => setIndex(null)}>Clear selection</button>
      </div>
    </div>
  );
}

export const Controlled = {
  name: 'Controlled selection with a detail panel',
  parameters: { docs: { description: { story: '`selectedIndex` and `onSelect` keep the selection in host state, so a panel beside the chart can describe the slice and clear it.' } } },
  render: () => <ControlledDonut />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await focusPlot(canvasElement, 'Workspaces by plan, selectable');
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await waitFor(() => expect(canvas.getByTestId('plan-detail')).toHaveTextContent('Team plan'));
    await userEvent.click(canvas.getByRole('button', { name: 'Clear selection' }));
    await waitFor(() => expect(canvas.getByTestId('plan-detail')).toHaveTextContent('All plans'));
  }
};
