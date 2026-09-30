import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'kbd',
  import.meta.glob('../../../../.storybook/fixtures/patterns/kbd/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/kbd/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Kbd', tags: ['autodocs'], ...catalogueMeta('kbd') };

export const KbdPattern1 = { name: 'Basic keys', ...pattern(1) };
export const KbdPattern2 = { name: 'Grouped keys', ...pattern(2) };
export const KbdPattern3 = { name: 'Keys with icons', ...pattern(3) };
export const KbdPattern4 = { name: 'Key inside an input', ...pattern(4) };
export const KbdPattern5 = { name: 'Shortcut in a tooltip', ...pattern(5) };
export const KbdPattern6 = { name: 'Shortcut reference list', ...pattern(6) };
