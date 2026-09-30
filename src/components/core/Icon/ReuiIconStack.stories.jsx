// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'icon-stack',
  import.meta.glob('../../../../.storybook/fixtures/reui/icon-stack/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/icon-stack/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Icon', tags: ['autodocs'], ...catalogueMeta('icon-stack') };

export const ReuiIconStack1 = { name: 'Isometric icon stack', ...pattern(1) };
export const ReuiIconStack2 = { name: 'Icon stack sizes', ...pattern(2) };
export const ReuiIconStack3 = { name: 'Icon stack colors', ...pattern(3) };
export const ReuiIconStack4 = { name: 'Icon stack with badge', ...pattern(4) };
export const ReuiIconStack5 = { name: 'Icon stack in an empty state', ...pattern(5) };
export const ReuiIconStack6 = { name: 'Icon stack in an item', ...pattern(6) };
