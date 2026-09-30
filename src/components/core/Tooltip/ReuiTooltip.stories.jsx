// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'tooltip',
  import.meta.glob('../../../../.storybook/fixtures/reui/tooltip/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/tooltip/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Tooltip', tags: ['autodocs'], ...catalogueMeta('tooltip') };

export const ReuiTooltip1 = { name: 'Basic tooltip', ...pattern(1) };
export const ReuiTooltip2 = { name: 'Sides', ...pattern(2) };
export const ReuiTooltip3 = { name: 'Icon trigger', ...pattern(3) };
export const ReuiTooltip4 = { name: 'Keyboard shortcut', ...pattern(4) };
export const ReuiTooltip5 = { name: 'Notification bell with count', ...pattern(5) };
export const ReuiTooltip6 = { name: 'Status badge', ...pattern(6) };
export const ReuiTooltip7 = { name: 'Icon and description', ...pattern(7) };
export const ReuiTooltip8 = { name: 'Toolbar actions', ...pattern(8) };
export const ReuiTooltip9 = { name: 'Warning badge', ...pattern(9) };
export const ReuiTooltip10 = { name: 'Feature badge and upgrade link', ...pattern(10) };
export const ReuiTooltip11 = { name: 'Avatar and role badge', ...pattern(11) };
export const ReuiTooltip12 = { name: 'Disabled button with wrapper', ...pattern(12) };
export const ReuiTooltip13 = { name: 'Online status indicator', ...pattern(13) };
export const ReuiTooltip14 = { name: 'File info and badges', ...pattern(14) };
export const ReuiTooltip15 = { name: 'Label badges', ...pattern(15) };
export const ReuiTooltip16 = { name: 'Action button inside', ...pattern(16) };
