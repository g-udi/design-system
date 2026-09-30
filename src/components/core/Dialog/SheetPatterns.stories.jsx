import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'sheet',
  import.meta.glob('../../../../.storybook/fixtures/patterns/sheet/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/sheet/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Dialog', tags: ['autodocs'], ...catalogueMeta('sheet') };

export const SheetPattern1 = { name: 'Sheet with profile form', ...pattern(1) };
export const SheetPattern2 = { name: 'Sheet without a close button', ...pattern(2) };
export const SheetPattern3 = { name: 'Sheet sides', ...pattern(3) };
export const SheetPattern4 = { name: 'Sheet with scrollable content', ...pattern(4) };
