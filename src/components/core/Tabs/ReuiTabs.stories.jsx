// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'tabs',
  import.meta.glob('../../../../.storybook/fixtures/reui/tabs/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/tabs/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Tabs', tags: ['autodocs'], ...catalogueMeta('tabs') };

export const ReuiTabs1 = { name: 'Basic tabs', ...pattern(1) };
export const ReuiTabs2 = { name: 'Tabs with line variant', ...pattern(2) };
export const ReuiTabs3 = { name: 'Tabs with vertical orientation', ...pattern(3) };
export const ReuiTabs4 = { name: 'Tabs with vertical orientation and line variant', ...pattern(4) };
export const ReuiTabs5 = { name: 'Tabs with icons', ...pattern(5) };
export const ReuiTabs6 = { name: 'Tabs with icons', ...pattern(6) };
export const ReuiTabs7 = { name: 'Tabs with badge counts', ...pattern(7) };
export const ReuiTabs8 = { name: 'Tabs with icons and line variant', ...pattern(8) };
export const ReuiTabs9 = { name: 'Segmented control tabs', ...pattern(9) };
