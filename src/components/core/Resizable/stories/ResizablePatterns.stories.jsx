import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'resizable', import.meta.url,
  import.meta.glob('./fixtures/resizable/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/resizable/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Layout & Containers/Resizable', id: 'core-resizable', tags: ['autodocs'], ...catalogueMeta('resizable') };

export const EditorWorkspace = { name: 'Editor workspace', ...pattern('editor-workspace', 'Three columns with a nested vertical split. `onLayoutChange` reports each panel size by `id` while dragging; string sizes are percentages.') };
export const Handles = { name: 'Handle styles', ...pattern('handles', 'The default line, the `withHandle` grip, and pill handles styled with `className` that grow on hover, tint while dragging and rotate with each handle orientation.') };
