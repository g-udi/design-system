import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'progress', import.meta.url,
  import.meta.glob('./fixtures/progress/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/progress/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Progress', id: 'core-progress', tags: ['autodocs'], ...catalogueMeta('progress') };

export const SizesColors = {
  name: 'Sizes and colors',
  ...pattern('sizes-colors', 'A slider drives every bar: three heights and indicator colors from the semantic tones or a custom class.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider', { name: 'Progress value' });
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('progressbar', { name: 'Large progress' })).toHaveAttribute('aria-valuenow', '57');
  }
};
export const StatusMessages = {
  name: 'Status messages',
  ...pattern('status-messages'),
  play: async (context) => {
    if (import.meta.env.MODE !== 'test') return;
    const canvas = within(context.canvasElement);
    const progress = canvas.getByRole('progressbar');
    const random = Math.random;
    try {
      // The fixture varies each tick; fixing only that input keeps its real timer
      // and progress/status coupling while making the complete cycle bounded.
      Math.random = () => 1;
      await waitFor(() => expect(Number(progress.getAttribute('aria-valuenow'))).toBeGreaterThanOrEqual(15), { timeout: 1500 });
      await expect(canvas.getByText(/Reading drafts|Checking image rights|Packing articles/)).toBeVisible();
      await waitFor(() => expect(canvas.getByText('Export ready to download.')).toBeVisible(), { timeout: 4500 });
      await expect(progress).toHaveAttribute('aria-valuenow', '100');
      await expect(canvas.getByText('100%')).toBeVisible();
      await waitFor(() => expect(canvas.getByText('Preparing the export...')).toBeVisible());
      await expect(Number(progress.getAttribute('aria-valuenow'))).toBeLessThan(5);
    } finally {
      Math.random = random;
    }
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--status-cycle` });
    }
  }
};
export const UploadList = {
  name: 'File upload list', ...pattern('upload-list'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('progressbar', { name: 'Upload progress for presentation.pptx' })).toHaveAttribute('aria-valuenow', '78');
    await expect(canvas.getByText('spreadsheet.xlsx')).toBeVisible();
  }
};
export const MultiStep = { name: 'Multi-step', ...pattern('multi-step') };
