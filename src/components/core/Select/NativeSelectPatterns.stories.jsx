import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'native-select',
  import.meta.glob('../../../../.storybook/fixtures/patterns/native-select/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/native-select/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', id: 'core-select', tags: ['autodocs'], ...catalogueMeta('native-select') };

export const NativeSelectPattern4 = { name: 'Native select fields', ...pattern(4, 'Grouped options with a disabled entry, the small size, and disabled and invalid fields.') };
