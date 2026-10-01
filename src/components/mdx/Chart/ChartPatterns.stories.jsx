import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'chart',
  import.meta.glob('../../../../.storybook/fixtures/patterns/chart/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/chart/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'MDX/Chart', tags: ['autodocs'], ...catalogueMeta('chart') };

const bars = (canvasElement) => canvasElement.querySelectorAll('.recharts-bar-rectangle');
const pick = (canvasElement, name) => userEvent.click(within(canvasElement).getByRole('radio', { name }));
const readout = (canvasElement) => canvasElement.querySelector('[data-slot="chart-readout"]');
/** Focus a chart's plot and jump to its first point. */
const focusPlot = async (canvasElement, name) => {
  const plot = await within(canvasElement).findByRole('group', { name });
  plot.focus();
  await userEvent.keyboard('{Home}');

  return plot;
};
const ready = (canvasElement, name) => waitFor(() => expect(within(canvasElement).getByRole('group', { name }).closest('[data-slot="chart"]')).toHaveAttribute('data-state', 'ready'));

// Grouped by chart type: the name starts with the type, so each one is easy to find.

export const ChartPattern13 = {
  name: 'Area · Fills, curves and stacking',
  ...pattern(13, 'Gradient, stripe, dot and crosshatch fills on smooth or step curves; switches stack three dashed series and add glowing markers.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const areas = () => canvasElement.querySelectorAll('.recharts-area-area');
    await waitFor(() => expect(areas().length).toBe(1));
    await userEvent.click(canvas.getByRole('switch', { name: 'Stacked' }));
    await waitFor(() => expect(areas().length).toBe(3));
    await pick(canvasElement, 'Crosshatch');
    await waitFor(() => expect(areas()[0].getAttribute('fill')).toMatch(/Crosshatch/));
    await userEvent.click(canvas.getByRole('switch', { name: 'Stacked' }));
    await pick(canvasElement, 'Gradient');
  }
};
export const ChartPattern30 = {
  name: 'Area · Annotated traffic with keyboard reading',
  ...pattern(30, 'Twelve months of readers and subscribers with a goal line and annotated launch and summer dip. Tab to the plot, read each month with the arrow keys, press Enter to pin it, and open the data table.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await focusPlot(canvasElement, 'Unique readers and new subscribers per month');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Jan: Readers 2,380, Subscribers 210'));
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Mar: Readers 3,920/));
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByTestId('pinned-month')).toHaveTextContent('Mar: Readers 3,920, Subscribers 610'));
    await userEvent.click(canvas.getByRole('button', { name: 'Show data' }));
    await waitFor(() => expect(canvas.getByRole('rowheader', { name: 'Aug' })).toBeVisible());
  }
};
export const ChartPattern1 = {
  name: 'Bar · Fills, comparison and layout',
  ...pattern(1, 'One bar chart with every fill: solid, gradient, stripes, dots, duotone and 3D. Switches add a second series with a legend and lay the bars out horizontally.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(bars(canvasElement).length).toBe(8));
    await pick(canvasElement, 'Stripes');
    await waitFor(() => expect(canvasElement.querySelector('.recharts-bar-rectangle path, .recharts-bar-rectangle rect')?.getAttribute('fill')).toMatch(/stripes/));
    await userEvent.click(canvas.getByRole('switch', { name: 'Compare' }));
    await waitFor(() => expect(bars(canvasElement).length).toBe(16));
    await pick(canvasElement, '3D');
    await expect(canvas.getByRole('switch', { name: 'Horizontal' })).toBeDisabled();
    await pick(canvasElement, 'Solid');
    await userEvent.click(canvas.getByRole('switch', { name: 'Compare' }));
  }
};
export const ChartPattern11 = { name: 'Bar · Hover to reveal values', ...pattern(11, 'Monochrome bars widen on hover and the header shows the hovered value.') };
export const ChartPattern40 = {
  name: 'Bar list · Top posts by source',
  ...pattern(40, 'Ranked posts as stacked bars of search, newsletter, social and direct readers; the switch draws each post as 100% to compare the mix.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement, 'Readers per post by traffic source');
    await expect(canvas.getByRole('cell', { name: '5,570' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('switch', { name: 'Compare mix' }));
    await waitFor(() => expect(canvas.getByText('Each post as 100%, to compare where its readers came from.')).toBeVisible());
    await expect(canvas.getAllByRole('cell', { name: '56%' }).length).toBeGreaterThan(0);
  }
};
export const ChartPattern34 = {
  name: 'Box plot · Response time by route',
  ...pattern(34, 'Median, quartiles, whiskers and slow outliers per route, switchable between regions.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await focusPlot(canvasElement, 'Response time distribution by route');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Home: Min 92/));
    await pick(canvasElement, 'Americas');
    await waitFor(() => expect(canvas.getAllByRole('cell', { name: '128' }).length).toBeGreaterThan(0));
  }
};
export const ChartPattern43 = {
  name: 'Bubble · Length, read time and shares',
  ...pattern(43, 'Essays by length and minutes read, with shares as the bubble size and an average line.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement, 'Essay length against minutes read, sized by shares');
    await userEvent.click(canvas.getByRole('button', { name: 'Show data' }));
    await waitFor(() => expect(canvas.getByRole('rowheader', { name: 'Running a calm team' })).toBeVisible());
  }
};
export const ChartPattern19 = {
  name: 'Donut · Patterned slices',
  ...pattern(19, 'Parts of a whole as a donut with a centre total or a full pie, with solid, gradient or patterned slices, a legend, and a hovered slice that grows.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText('Tasks')).toBeInTheDocument());
    await pick(canvasElement, 'Pie');
    await waitFor(() => expect(canvas.queryByText('Tasks')).not.toBeInTheDocument());
    await pick(canvasElement, 'Donut');
  }
};
export const ChartPattern42 = {
  name: 'Donut · Select a topic, small slices as Other',
  ...pattern(42, 'A selectable donut: click or press Enter on a slice to pin it, the centre shows its share, and topics under 5% fold into Other.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await focusPlot(canvasElement, 'Essays by topic this year');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Engineering' })).toBeVisible());
    await expect(canvas.getByText('Notes on local-first software')).toBeVisible();
    await userEvent.keyboard('{End}{Enter}');
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'Other' })).toBeVisible());
    await expect(canvas.getByText('Working from Lisbon')).toBeVisible();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('heading', { name: 'No topic selected' })).toBeVisible());
  }
};
export const ChartPattern32 = {
  name: 'Funnel · Newsletter signups',
  ...pattern(32, 'Five steps from reading a post to opening the first issue, with the conversion from each step to the next, as bars or a centred funnel.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement, 'Newsletter signup funnel');
    await expect(canvas.getByText('23.8% from previous')).toBeVisible();
    await pick(canvasElement, 'Quarter');
    await waitFor(() => expect(canvas.getAllByText('39,800').length).toBeGreaterThan(0));
    await pick(canvasElement, 'Funnel');
  }
};
export const ChartPattern41 = {
  name: 'Gauge · Core Web Vitals',
  ...pattern(41, 'Three readings against their good, needs-work and poor thresholds, each with a target tick.'),
  play: async ({ canvasElement }) => {
    await ready(canvasElement, 'Largest contentful paint gauge');
    await ready(canvasElement, 'Interaction to next paint gauge');
    await expect(within(canvasElement).getAllByText('Needs work').length).toBeGreaterThan(0);
  }
};
export const ChartPattern35 = {
  name: 'Heatmap · Errors by service and hour',
  ...pattern(35, 'Errors per service in three-hour windows on a sequential ramp, or the change against last week on a diverging scale. Arrow keys move along a row; Up and Down change service.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await focusPlot(canvasElement, 'Errors by service and time of day');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Web · 00:00: Errors 2'));
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('API · 00:00: Errors 5'));
    await pick(canvasElement, 'Change');
    await waitFor(() => expect(canvas.getByRole('group', { name: 'Change in errors against last week' })).toBeInTheDocument());
  }
};
export const ChartPattern31 = {
  name: 'Histogram · Reading time with median and p90',
  ...pattern(31, 'Minutes spent on 60 essays in round bins, with labelled median and p90 markers; switch between coarse and fine bins.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement, 'Distribution of reading time across 60 essays');
    const rows = () => canvas.getAllByRole('rowheader').length;
    const fine = rows();
    await pick(canvasElement, 'Coarse');
    await waitFor(() => expect(rows()).toBeLessThan(fine));
  }
};
export const ChartPattern17 = { name: 'Line · Forecast with a stripe zone', ...pattern(17, 'A projected series drawn as a line over a striped area.') };
export const ChartPattern23 = {
  name: 'Radar · Scores against a target',
  ...pattern(23, 'Scores across six areas on a fixed 0 to 100 scale; the switch overlays a dashed target with hollow markers.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const radars = () => canvasElement.querySelectorAll('.recharts-radar');
    await waitFor(() => expect(radars().length).toBe(1));
    await userEvent.click(canvas.getByRole('switch', { name: 'Compare with target' }));
    await waitFor(() => expect(radars().length).toBe(2));
    await userEvent.click(canvas.getByRole('switch', { name: 'Compare with target' }));
  }
};
export const ChartPattern25 = { name: 'Radial · Labelled scores', ...pattern(25, 'Lighthouse scores per platform as labelled radial bars.') };
export const ChartPattern33 = {
  name: 'Range · Release burn-down forecast',
  ...pattern(33, 'Open issues so far as a line, then the forecast range to launch as a band, with today and the launch-ready line marked.'),
  play: async ({ canvasElement }) => {
    await focusPlot(canvasElement, 'Open issues for the 2.0 release, with the forecast to launch');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Day 1: Open issues 64/));
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Day 14: Forecast low 0, Forecast high 21'));
  }
};
export const ChartPattern36 = {
  name: 'Sankey · Where readers go',
  ...pattern(36, 'Arrivals by source flow into essays or notes and on to reading more, subscribing or leaving; each flow is a point for the arrow keys.'),
  play: async ({ canvasElement }) => {
    await focusPlot(canvasElement, 'Reader flow from source to post type to next action');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Search → Essays: Readers 4,820'));
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent('Search → Notes: Readers 1,310'));
  }
};
export const ChartPattern37 = {
  name: 'Sparkline · Stat cards with trends',
  ...pattern(37, 'Three stat cards, each with a word-sized trend: an area, bars against a target and a line.'),
  play: async ({ canvasElement }) => {
    for (const name of [ 'Readers, last 14 days', 'Signups, last 14 days', 'Unsubscribes, last 14 days' ]) await ready(canvasElement, name);
  }
};
export const ChartPattern44 = {
  name: 'States · Loading, empty, invalid, error and locale',
  ...pattern(44, 'One chart through every state, with copy written for its dashboard, and numbers reformatted for each locale.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement, 'Weekly views');
    await expect(canvas.getByRole('cell', { name: '12.8K' })).toBeInTheDocument();
    await pick(canvasElement, 'de-DE');
    await waitFor(() => expect(canvas.getByRole('cell', { name: '12.840' })).toBeInTheDocument());
    await pick(canvasElement, 'empty');
    await waitFor(() => expect(canvas.getByText('No views yet. Publish a post to start the count.')).toBeVisible());
    await pick(canvasElement, 'invalid');
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent('still being counted'));
    await pick(canvasElement, 'loading');
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="chart"]')).toHaveAttribute('aria-busy', 'true'));
    await pick(canvasElement, 'error');
    await waitFor(() => expect(canvas.getByRole('alert')).toHaveTextContent('Views could not load.'));
    await pick(canvasElement, 'ready');
    await pick(canvasElement, 'en-US');
  }
};
export const ChartPattern39 = {
  name: 'Treemap · Storage by folder',
  ...pattern(39, 'Media storage by folder and file type, tinted by folder or shaded by size on the heat ramp.'),
  play: async ({ canvasElement }) => {
    await focusPlot(canvasElement, 'Media storage by folder and file type');
    await waitFor(() => expect(readout(canvasElement)).toHaveTextContent(/^Images · Covers: Size 1\.8 GB/));
    await pick(canvasElement, 'Size');
    await ready(canvasElement, 'Media storage by folder and file type');
  }
};
export const ChartPattern38 = {
  name: 'Waterfall · Recurring revenue bridge',
  ...pattern(38, 'Recurring revenue from one month to the next through new plans, upgrades, downgrades and cancellations, in euros, with the number format switchable between English and German.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await ready(canvasElement, 'Recurring revenue bridge from September to October');
    await userEvent.click(canvas.getByRole('button', { name: 'Show data' }));
    await waitFor(() => expect(canvas.getByRole('cell', { name: '€48,200' })).toBeVisible());
    await pick(canvasElement, 'Deutsch');
    // German currency format puts a no-break space before the euro sign.
    await waitFor(() => expect(canvas.getByRole('cell', { name: /^48\.200\s€$/ })).toBeVisible());
  }
};
