import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'attachment',
  import.meta.glob('../../../../.storybook/fixtures/patterns/attachment/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/attachment/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Attachment', tags: ['autodocs'], ...catalogueMeta('attachment') };

export const AttachmentPattern1 = { name: 'Single file in an assistant reply', ...pattern(1) };
export const AttachmentPattern2 = {
  name: 'Composer tray with removable files',
  ...pattern(2),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tray = canvas.getByRole('group', { name: 'Attached files' });
    await userEvent.click(canvas.getByRole('button', { name: 'Remove pricing-tiers-v4.xlsx' }));
    await expect(within(tray).queryByText('pricing-tiers-v4.xlsx')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Attach a file' }));
    await expect(within(tray).getByText('pricing-tiers-v4.xlsx')).toBeVisible();
  }
};
export const AttachmentPattern3 = { name: 'Image thumbnail strip', ...pattern(3) };
export const AttachmentPattern4 = { name: 'Three sizes', ...pattern(4) };
export const AttachmentPattern5 = { name: 'Upload queue in every state', ...pattern(5) };
export const AttachmentPattern6 = { name: 'File picker that fills a tray', ...pattern(6) };
