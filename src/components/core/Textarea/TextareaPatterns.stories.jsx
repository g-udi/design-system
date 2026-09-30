import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'textarea',
  import.meta.glob('../../../../.storybook/fixtures/patterns/textarea/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/textarea/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Textarea', tags: ['autodocs'], ...catalogueMeta('textarea') };

export const TextareaPattern1 = { name: 'Basic textarea', ...pattern(1) };
export const TextareaPattern2 = { name: 'Invalid', ...pattern(2) };
export const TextareaPattern3 = { name: 'With label', ...pattern(3) };
export const TextareaPattern4 = { name: 'With description', ...pattern(4) };
export const TextareaPattern5 = { name: 'Disabled', ...pattern(5) };
export const TextareaPattern6 = { name: 'Auto-resize with character count', ...pattern(6) };
