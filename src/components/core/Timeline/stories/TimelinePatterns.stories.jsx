import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'timeline', import.meta.url,
  import.meta.glob('./fixtures/timeline/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/timeline/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Data Display/Timeline', id: 'core-timeline', tags: ['autodocs'], ...catalogueMeta('timeline') };

export const VerticalProgress = { name: 'Vertical progress', ...pattern('vertical-progress', 'Switch the indicator between a dot, a check and an icon, move dates into a leading column, or hide descriptions for a compact log.') };
export const HorizontalReleases = { name: 'Horizontal releases', ...pattern('horizontal-releases', 'Status indicators and a current badge on a horizontal rail, with dates below or above it.') };
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
export const PipelineSteps = { name: 'Pipeline steps', ...pattern('pipeline-steps', 'Each step shows its status and duration and folds its details into a collapsible panel.') };
export const Alternating = { name: 'Alternating milestones', ...pattern('alternating') };
