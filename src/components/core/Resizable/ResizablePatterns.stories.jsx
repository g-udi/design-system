import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'resizable',
  import.meta.glob('../../../../.storybook/fixtures/patterns/resizable/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/resizable/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Resizable', tags: ['autodocs'], ...catalogueMeta('resizable') };

export const ResizablePattern9 = { name: 'Editor workspace', ...pattern(9, 'Three columns with a nested vertical split. `onLayoutChange` reports each panel size by `id` while dragging; string sizes are percentages.') };
export const ResizablePattern5 = { name: 'Handle styles', ...pattern(5, 'The default line, the `withHandle` grip, and pill handles styled with `className` that grow on hover, tint while dragging and rotate with each handle orientation.') };
