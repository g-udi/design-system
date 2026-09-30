// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'resizable',
  import.meta.glob('../../../../.storybook/fixtures/reui/resizable/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/resizable/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Resizable', tags: ['autodocs'], ...catalogueMeta('resizable') };

export const ReuiResizable1 = { name: 'Vertical split', ...pattern(1) };
export const ReuiResizable2 = { name: 'Horizontal split', ...pattern(2) };
export const ReuiResizable3 = { name: 'Nested groups', ...pattern(3, 'A vertical group inside a horizontal panel.') };
export const ReuiResizable4 = { name: 'Nested groups with grips', ...pattern(4, '`withHandle` adds a visible grip. String sizes are percentages; numbers are pixels.') };
export const ReuiResizable5 = { name: 'Pill handle', ...pattern(5, 'A pill grows on hover and turns primary while dragging.') };
export const ReuiResizable6 = { name: 'Scaling pill handle', ...pattern(6) };
export const ReuiResizable7 = { name: 'Capsule handle', ...pattern(7, 'The handle track tints and the pill stretches while dragging.') };
export const ReuiResizable8 = { name: 'Nested pill handles', ...pattern(8, 'Pills rotate to match each handle orientation.') };
export const ReuiResizable9 = { name: 'Three panels', ...pattern(9) };
export const ReuiResizable10 = { name: 'Live sizes', ...pattern(10, '`onLayoutChange` reports each panel size by `id` while dragging.') };
