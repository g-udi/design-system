// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'switch',
  import.meta.glob('../../../../.storybook/fixtures/reui/switch/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/switch/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Switch', tags: ['autodocs'], ...catalogueMeta('switch') };

export const ReuiSwitch1 = { name: 'Basic switch', ...pattern(1) };
export const ReuiSwitch2 = { name: 'Switch with description', ...pattern(2) };
export const ReuiSwitch3 = { name: 'Disabled switch', ...pattern(3) };
export const ReuiSwitch4 = { name: 'Switch in different sizes', ...pattern(4) };
export const ReuiSwitch5 = { name: 'Switch group', ...pattern(5) };
export const ReuiSwitch6 = { name: 'Switch list in card with separators', ...pattern(6) };
export const ReuiSwitch7 = { name: 'Switch list in card with icons', ...pattern(7) };
export const ReuiSwitch8 = { name: 'Switch in frame', ...pattern(8) };
export const ReuiSwitch9 = { name: 'Switch with tooltip info', ...pattern(9) };
export const ReuiSwitch10 = { name: 'Switch with badges', ...pattern(10) };
export const ReuiSwitch11 = { name: 'Colored switches', ...pattern(11) };
export const ReuiSwitch12 = { name: 'Destructive switch with confirmation text', ...pattern(12) };
export const ReuiSwitch13 = { name: 'Compact settings table with switches', ...pattern(13) };
export const ReuiSwitch14 = { name: 'Switch with descriptions in card grid', ...pattern(14) };
