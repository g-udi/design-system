import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'native-select',
  import.meta.glob('../../../../.storybook/fixtures/patterns/native-select/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/native-select/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', tags: ['autodocs'], ...catalogueMeta('native-select') };

export const NativeSelectPattern1 = { name: 'Basic native select', ...pattern(1) };
export const NativeSelectPattern2 = { name: 'Grouped native select', ...pattern(2) };
export const NativeSelectPattern3 = { name: 'Small native select', ...pattern(3) };
export const NativeSelectPattern4 = { name: 'Native select in a field', ...pattern(4) };
export const NativeSelectPattern5 = { name: 'Disabled native select', ...pattern(5) };
export const NativeSelectPattern6 = { name: 'Invalid native select', ...pattern(6) };
