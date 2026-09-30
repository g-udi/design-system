// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'icon-stack',
  import.meta.glob('../../../../.storybook/fixtures/reui/icon-stack/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/icon-stack/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Icon', tags: ['autodocs'], ...catalogueMeta('icon-stack') };

export const ReuiIconStack1 = { name: 'Icon Stack: Isometric icon stack', ...pattern(1, 'Layered isometric icon') };
export const ReuiIconStack2 = { name: 'Icon Stack: Icon stack sizes', ...pattern(2, 'Responsive icon stack sizes') };
export const ReuiIconStack3 = { name: 'Icon Stack: Icon stack colors', ...pattern(3, 'Semantic icon stack colors') };
export const ReuiIconStack4 = { name: 'Icon Stack: Icon badge stack', ...pattern(4, 'Icon stack with badge overlay') };
export const ReuiIconStack5 = { name: 'Icon Stack: Empty state illustration', ...pattern(5, 'Shadcn empty state illustration') };
export const ReuiIconStack6 = { name: 'Icon Stack: Item media stack', ...pattern(6, 'Icon stack in shadcn item') };
