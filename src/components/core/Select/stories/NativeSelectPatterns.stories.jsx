import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'native-select', import.meta.url,
  import.meta.glob('./fixtures/native-select/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/native-select/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', id: 'core-select', tags: ['autodocs'], ...catalogueMeta('native-select') };

export const NativeSelectFields = { name: 'Native select fields', ...pattern('fields', 'Grouped options with a disabled entry, the small size, and disabled and invalid fields.') };
