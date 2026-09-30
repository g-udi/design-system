// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'drawer',
  import.meta.glob('../../../../.storybook/fixtures/reui/drawer/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/drawer/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Dialog', tags: ['autodocs'], ...catalogueMeta('drawer') };

export const ReuiDrawer1 = { name: 'Drawer with scrollable content', ...pattern(1) };
export const ReuiDrawer2 = { name: 'Drawer from the right', ...pattern(2) };
export const ReuiDrawer3 = { name: 'Drawer from the left', ...pattern(3) };
export const ReuiDrawer4 = { name: 'Drawer from the top', ...pattern(4) };
export const ReuiDrawer5 = { name: 'Drawer sides', ...pattern(5) };
