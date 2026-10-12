import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'chat-file', import.meta.url,
  import.meta.glob('./fixtures/chat-file/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/chat-file/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Chat/ChatMessage', id: 'chat-message', tags: ['autodocs'], ...catalogueMeta('chat-file') };

export const ChatFileDeliveredFiles = {
  name: 'Delivered files and data',
  ...pattern('delivered-files', 'Structured values read as a list with a JSON view, and delivered files offer preview and download.'),
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    for (const file of ['september-report.pdf', 'subscribers-2026-09.csv']) {
      await userEvent.click(canvas.getByRole('button', { name: `Preview ${file}` }));
      await expect(await canvas.findByText(`Opening ${file}`, { exact: true })).toHaveAttribute('role', 'status');
      if (file === 'september-report.pdf' && import.meta.env.VITE_GAUDI_AUDIT === '1') {
        const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
        await auditStoryLayout({ ...context, id: `${context.id}--preview-requested` });
      }
      await userEvent.click(canvas.getByRole('button', { name: `Download ${file}` }));
      await expect(await canvas.findByText(`Downloading ${file}`, { exact: true })).toHaveAttribute('role', 'status');
      await expect(canvas.queryByText(`Opening ${file}`, { exact: true })).not.toBeInTheDocument();
    }
  }
};
