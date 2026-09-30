// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'tooltip',
  import.meta.glob('../../../../.storybook/fixtures/reui/tooltip/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/tooltip/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Tooltip', tags: ['autodocs'], ...catalogueMeta('tooltip') };

export const ReuiTooltip1 = { name: 'Basic tooltip', ...pattern(1) };
export const ReuiTooltip2 = { name: 'Tooltips opening from different sides', ...pattern(2) };
export const ReuiTooltip3 = { name: 'Tooltip with icon trigger', ...pattern(3) };
export const ReuiTooltip4 = { name: 'Tooltip with keyboard shortcut', ...pattern(4) };
export const ReuiTooltip5 = { name: 'Tooltip on notification bell with badge count', ...pattern(5) };
export const ReuiTooltip6 = { name: 'Tooltip with status badge', ...pattern(6) };
export const ReuiTooltip7 = { name: 'Tooltip with icon and description', ...pattern(7) };
export const ReuiTooltip8 = { name: 'Toolbar with tooltip actions', ...pattern(8) };
export const ReuiTooltip9 = { name: 'Tooltip with warning badge', ...pattern(9) };
export const ReuiTooltip10 = { name: 'Tooltip with feature badge and upgrade link', ...pattern(10) };
export const ReuiTooltip11 = { name: 'Tooltip with avatar and role badge', ...pattern(11) };
export const ReuiTooltip12 = { name: 'Tooltip on disabled button with wrapper', ...pattern(12) };
export const ReuiTooltip13 = { name: 'Tooltip with online status indicator', ...pattern(13) };
export const ReuiTooltip14 = { name: 'Tooltip with file info and badges', ...pattern(14) };
export const ReuiTooltip15 = { name: 'Tooltip with label badges', ...pattern(15) };
export const ReuiTooltip16 = { name: 'Tooltip with action button inside', ...pattern(16) };
