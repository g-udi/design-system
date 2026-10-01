import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'timeline',
  import.meta.glob('../../../../.storybook/fixtures/patterns/timeline/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/timeline/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Data Display/Timeline', id: 'core-timeline', tags: ['autodocs'], ...catalogueMeta('timeline') };

export const TimelinePattern3 = { name: 'Vertical progress', ...pattern(3, 'Switch the indicator between a dot, a check and an icon, move dates into a leading column, or hide descriptions for a compact log.') };
export const TimelinePattern12 = { name: 'Horizontal releases', ...pattern(12, 'Status indicators and a current badge on a horizontal rail, with dates below or above it.') };
export const TimelinePattern11 = {
  name: 'Activity stream',
  ...pattern(11, 'Avatars replace the indicator and each event carries its own payload: downloadable attachments, a participant group, deploy status, progress or a rating. Every event has an actions menu; Delete removes it from the stream.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Download roadmap-q4.pdf' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Actions for Sofia Martins: preview' }));
    await userEvent.click(await within(document.body).findByRole('menuitem', { name: 'Delete event' }));
    await waitFor(() => expect(canvas.queryByText('deployed i7j8k9l to')).not.toBeInTheDocument());
  }
};
export const TimelinePattern13 = { name: 'Release changelog', ...pattern(13, 'Versions with a summary and badges for the kind of change, impact and size; from sm up the dates sit in a rail left of the line.') };
export const TimelinePattern6 = { name: 'Pipeline steps', ...pattern(6, 'Each step shows its status and duration and folds its details into a collapsible panel.') };
export const TimelinePattern5 = { name: 'Alternating milestones', ...pattern(5) };
