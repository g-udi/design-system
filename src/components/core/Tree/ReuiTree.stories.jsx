// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';

const pattern = reuiPatterns(
  'tree',
  import.meta.glob('../../../../.storybook/fixtures/reui/tree/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/tree/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Tree', tags: ['autodocs'], ...catalogueMeta('tree') };

export const ReuiTree1 = {
  name: 'Basic tree.',
  ...pattern(1, 'Basic tree.'),
  play: catalogueInteractions['tree-1']
};
export const ReuiTree2 = { name: 'Tree with indented lines', ...pattern(2) };
export const ReuiTree3 = { name: 'Tree with custom indent', ...pattern(3) };
export const ReuiTree4 = { name: 'Tree with custom indent', ...pattern(4) };
export const ReuiTree5 = { name: 'File explorer tree with type icons', ...pattern(5) };
export const ReuiTree6 = { name: 'Organization chart tree with avatars', ...pattern(6) };
export const ReuiTree7 = { name: 'Permissions tree with checkboxes', ...pattern(7) };
