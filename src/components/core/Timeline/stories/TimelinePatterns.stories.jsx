import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'timeline', import.meta.url,
  import.meta.glob('./fixtures/timeline/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/timeline/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Data Display/Timeline', id: 'core-timeline', tags: ['autodocs'], ...catalogueMeta('timeline') };

async function auditState(context, state) {
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
  await auditStoryLayout({ ...context, id: `${context.id}--${state}` });
}

export const VerticalProgress = {
  name: 'Vertical progress', ...pattern('vertical-progress', 'Switch the indicator between a dot, a check and an icon, move dates into a leading column, or hide descriptions for a compact log.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    const description = 'The studio has your order for the annual print edition.';
    for (const name of ['Dot', 'Icon', 'Check']) {
      const choice = canvas.getByRole('radio', { name });
      await userEvent.click(choice);
      await expect(choice).toBeChecked();
      await expect(canvas.getByText(description)).toBeVisible();
      await auditState(context, name.toLowerCase());
    }
    const leading = canvas.getByRole('switch', { name: 'Leading dates' });
    await userEvent.click(leading);
    await expect(leading).toBeChecked();
    await auditState(context, 'leading-dates');
    const compact = canvas.getByRole('switch', { name: 'Compact' });
    await userEvent.click(compact);
    await expect(canvas.queryByText(description)).not.toBeInTheDocument();
    await expect(canvas.getByText('Print order placed')).toBeVisible();
    await auditState(context, 'compact');
    await userEvent.click(compact);
    await userEvent.click(leading);
    await expect(canvas.getByText(description)).toBeVisible();
  }
};
export const HorizontalReleases = {
  name: 'Horizontal releases', ...pattern('horizontal-releases', 'Status indicators and a current badge on a horizontal rail, with dates below or above it.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    const toggle = canvas.getByRole('switch', { name: 'Dates above the rail' });
    const date = canvas.getByText('Jan 2025');
    const railViewport = canvas.getByRole('region', { name: 'Release timeline' });
    await userEvent.tab();
    await expect(toggle).toHaveFocus();
    await userEvent.tab();
    await expect(railViewport).toHaveFocus();
    const indicator = context.canvasElement.querySelector('[data-slot="timeline-indicator"]');
    await expect(date.getBoundingClientRect().top).toBeGreaterThan(indicator.getBoundingClientRect().top);
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await waitFor(() => expect(date.getBoundingClientRect().top).toBeLessThan(indicator.getBoundingClientRect().top));
    await expect(canvas.getByText('Current')).toBeVisible();
    await auditState(context, 'dates-above');
    await userEvent.click(toggle);
    await expect(date.getBoundingClientRect().top).toBeGreaterThan(indicator.getBoundingClientRect().top);
  }
};
export const ActivityStream = {
  name: 'Activity stream',
  ...pattern('activity-stream', 'Avatars replace the indicator and each event carries its own payload: downloadable attachments, a participant group, deploy status, progress or a rating. Every event has an actions menu; Delete removes it from the stream.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Download roadmap-q4.txt' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Download roadmap-q4.txt' })).toHaveAttribute('download', 'roadmap-q4.txt');
    await userEvent.click(canvas.getByRole('button', { name: 'Actions for Sabine Okafor: Q4 planning' }));
    await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Mute thread' }));
    await expect(canvas.getByText('Muted')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Actions for Sofia Martins: preview' }));
    await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Delete event' }));
    await waitFor(() => expect(canvas.queryByText('deployed i7j8k9l to')).not.toBeInTheDocument());
  }
};
export const Changelog = { name: 'Release changelog', ...pattern('changelog', 'Versions with a summary and badges for the kind of change, impact and size; from sm up the dates sit in a rail left of the line.') };
export const PipelineSteps = {
  name: 'Pipeline steps', ...pattern('pipeline-steps', 'Each step shows its status and duration and folds its details into a collapsible panel.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    const toggles = canvas.getAllByRole('button');
    await expect(toggles).toHaveLength(4);
    for (const toggle of toggles) {
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await userEvent.click(toggle);
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    }
    await waitFor(() => expect(canvas.queryByText('Pulled the latest posts and drafts from the content repository.')).not.toBeInTheDocument());
    await auditState(context, 'collapsed');
    for (const toggle of toggles) await userEvent.click(toggle);
    await expect(canvas.getByText('Pulled the latest posts and drafts from the content repository.')).toBeVisible();
  }
};
export const Alternating = { name: 'Alternating milestones', ...pattern('alternating') };
