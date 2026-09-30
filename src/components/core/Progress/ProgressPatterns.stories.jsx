import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'progress',
  import.meta.glob('../../../../.storybook/fixtures/patterns/progress/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/progress/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Progress', id: 'core-progress', tags: ['autodocs'], ...catalogueMeta('progress') };

export const ProgressPattern1 = {
  name: 'Sizes and colors',
  ...pattern(1, 'A slider drives every bar: three heights and indicator colors from the semantic tones or a custom class.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thumb = canvas.getByRole('slider', { name: 'Progress value' });
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('progressbar', { name: 'Large progress' })).toHaveAttribute('aria-valuenow', '57');
  }
};
export const ProgressPattern4 = { name: 'Status messages', ...pattern(4) };
export const ProgressPattern5 = { name: 'File upload list', ...pattern(5) };
export const ProgressPattern7 = { name: 'Multi-step', ...pattern(7) };
