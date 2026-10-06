import { DashboardExample, layouts, today } from './fixtures/DashboardExample.jsx';
import DashboardExampleSource from './fixtures/DashboardExample.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { playgroundSource } from '../../../../docs/components/previewSource.js';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

import { DashboardGrid, DashboardToolbar } from '../index.js';

const docs = getComponentDocs('Blocks/Dashboard');

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
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { period: '30d', compare: true, layout: 'focus', showDescriptions: true },
  parameters: {
    docs: {
      description: { story: 'A reading dashboard: the toolbar sets the period and comparison, and the grid reflows by its own width, twelve columns wide, six in a narrower container and one on a phone. `layout` changes how the two panels share the row, through their `span`.' },
      source: playgroundSource('DashboardExample', { imports: publicSource(DashboardExampleSource, new URL('./fixtures/DashboardExample.jsx', import.meta.url)) })
    }
  },
  render: (args) => <DashboardExample {...args} />,
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
