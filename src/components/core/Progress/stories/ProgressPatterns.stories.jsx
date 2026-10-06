import { expect, userEvent, within } from 'storybook/test';
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
export const StatusMessages = { name: 'Status messages', ...pattern('status-messages') };
export const UploadList = {
  name: 'File upload list', ...pattern('upload-list'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('progressbar', { name: 'Upload progress for presentation.pptx' })).toHaveAttribute('aria-valuenow', '78');
    await expect(canvas.getByText('spreadsheet.xlsx')).toBeVisible();
  }
};
export const MultiStep = { name: 'Multi-step', ...pattern('multi-step') };
