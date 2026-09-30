// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'resizable',
  import.meta.glob('../../../../.storybook/fixtures/reui/resizable/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/resizable/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Resizable', tags: ['autodocs'], ...catalogueMeta('resizable') };

export const ReuiResizable1 = { name: 'Horizontal resizable layout', ...pattern(1) };
export const ReuiResizable2 = { name: 'Vertical resizable layout', ...pattern(2) };
export const ReuiResizable3 = { name: 'Nested mixed-direction resizable layout', ...pattern(3) };
export const ReuiResizable4 = { name: 'Nested resizable', ...pattern(4) };
export const ReuiResizable5 = { name: 'Handle with animated pill indicator', ...pattern(5) };
export const ReuiResizable6 = { name: 'Handle pill with spring scale on drag', ...pattern(6) };
export const ReuiResizable7 = { name: 'Handle with large capsule expansion on drag', ...pattern(7) };
export const ReuiResizable8 = { name: 'Nested layout with animated pill handles', ...pattern(8) };
export const ReuiResizable9 = { name: 'Three-panel layout with animated pill handles', ...pattern(9) };
export const ReuiResizable10 = { name: 'State-tracked resizable layout', ...pattern(10) };
