// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = reuiPatterns(
  'attachment',
  import.meta.glob('../../../../.storybook/fixtures/reui/attachment/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/attachment/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Attachment', tags: ['autodocs'], ...catalogueMeta('attachment') };

export const ReuiAttachment1 = { name: 'Single file in an assistant reply', ...pattern(1) };
export const ReuiAttachment2 = {
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
export const ReuiAttachment3 = { name: 'Image thumbnail strip', ...pattern(3) };
export const ReuiAttachment4 = { name: 'Three sizes', ...pattern(4) };
export const ReuiAttachment5 = { name: 'Upload queue in every state', ...pattern(5) };
export const ReuiAttachment6 = { name: 'File picker that fills a tray', ...pattern(6) };
