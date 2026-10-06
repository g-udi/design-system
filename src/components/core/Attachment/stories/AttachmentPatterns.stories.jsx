import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'attachment', import.meta.url,
  import.meta.glob('./fixtures/attachment/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/attachment/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Messaging/Attachment', id: 'core-attachment', tags: ['autodocs'], ...catalogueMeta('attachment') };

export const AssistantReply = {
  name: 'Files in an assistant reply',
  ...pattern('assistant-reply', 'The default, `sm` and `xs` sizes as the deliverable, working files and cited snippets of one reply. The deliverable downloads a real local Markdown sample.'),
  play: async ({ canvasElement }) => {
    const download = within(canvasElement).getByRole('link', { name: 'Download billing-incident-report.md' });
    await expect(download).toHaveAttribute('download', 'billing-incident-report.md');
    await expect(decodeURIComponent(download.getAttribute('href'))).toContain('# Billing incident report');
    await expect(decodeURIComponent(download.getAttribute('href'))).toContain('Sample attachment for this local demo.');
  }
};
export const ComposerTray = {
  name: 'Composer tray with removable files',
  ...pattern('composer-tray'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tray = canvas.getByRole('group', { name: 'Attached files' });
    await userEvent.click(canvas.getByRole('button', { name: 'Remove pricing-tiers-v4.xlsx' }));
    await expect(within(tray).queryByText('pricing-tiers-v4.xlsx')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Attach a file' }));
    await expect(within(tray).getByText('pricing-tiers-v4.xlsx')).toBeVisible();
  }
};
export const FilePicker = { name: 'File picker that fills a tray', ...pattern('file-picker', 'An idle attachment acts as the picker, and each chosen file lands below it with a preview.') };
export const ThumbnailStrip = { name: 'Image thumbnail strip', ...pattern('thumbnail-strip', 'Vertical image cards scroll in a strip, and a full-card trigger selects one.') };
