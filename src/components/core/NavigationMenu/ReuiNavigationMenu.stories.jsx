// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'navigation-menu',
  import.meta.glob('../../../../.storybook/fixtures/reui/navigation-menu/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/navigation-menu/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/Navigation/Navigation Menu', tags: ['autodocs'], ...catalogueMeta('navigation-menu') };

export const ReuiNavigationMenu1 = { name: 'Basic navigation menu', ...pattern(1) };
export const ReuiNavigationMenu2 = { name: 'Grid layout', ...pattern(2) };
export const ReuiNavigationMenu3 = { name: 'With icons', ...pattern(3) };
export const ReuiNavigationMenu4 = { name: 'Grid layout with a call to action', ...pattern(4) };
