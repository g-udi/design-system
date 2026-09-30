import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'resizable',
  import.meta.glob('../../../../.storybook/fixtures/patterns/resizable/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/resizable/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Resizable', tags: ['autodocs'], ...catalogueMeta('resizable') };

export const ResizablePattern1 = { name: 'Vertical split', ...pattern(1) };
export const ResizablePattern2 = { name: 'Horizontal split', ...pattern(2) };
export const ResizablePattern3 = { name: 'Nested groups', ...pattern(3, 'A vertical group inside a horizontal panel.') };
export const ResizablePattern4 = { name: 'Nested groups with grips', ...pattern(4, '`withHandle` adds a visible grip. String sizes are percentages; numbers are pixels.') };
export const ResizablePattern5 = { name: 'Pill handle', ...pattern(5, 'A pill grows on hover and turns primary while dragging.') };
export const ResizablePattern6 = { name: 'Scaling pill handle', ...pattern(6) };
export const ResizablePattern7 = { name: 'Capsule handle', ...pattern(7, 'The handle track tints and the pill stretches while dragging.') };
export const ResizablePattern8 = { name: 'Nested pill handles', ...pattern(8, 'Pills rotate to match each handle orientation.') };
export const ResizablePattern9 = { name: 'Three panels', ...pattern(9) };
export const ResizablePattern10 = { name: 'Live sizes', ...pattern(10, '`onLayoutChange` reports each panel size by `id` while dragging.') };
