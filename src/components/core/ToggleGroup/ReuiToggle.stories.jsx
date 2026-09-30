// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'toggle',
  import.meta.glob('../../../../.storybook/fixtures/reui/toggle/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/toggle/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ToggleGroup', tags: ['autodocs'], ...catalogueMeta('toggle') };

export const ReuiToggle1 = { name: 'Basic toggle', ...pattern(1) };
export const ReuiToggle2 = { name: 'Outline toggle buttons', ...pattern(2) };
export const ReuiToggle3 = { name: 'Toggle sizes', ...pattern(3) };
export const ReuiToggle4 = { name: 'Toggle with button and icon', ...pattern(4) };
export const ReuiToggle5 = { name: 'Disabled toggle', ...pattern(5) };
export const ReuiToggle6 = { name: 'Toggle with icon', ...pattern(6) };
export const ReuiToggle7 = { name: 'Toggle with count badge', ...pattern(7) };
export const ReuiToggle8 = { name: 'Toggle size variants', ...pattern(8) };
export const ReuiToggle9 = { name: 'Toggle with icon swap', ...pattern(9) };
export const ReuiToggle10 = { name: 'Toggle with changing label', ...pattern(10) };
export const ReuiToggle11 = { name: 'Reaction toggles', ...pattern(11) };
export const ReuiToggle12 = { name: 'Toggle with tooltip', ...pattern(12) };
export const ReuiToggle13 = { name: 'Disabled toggle states', ...pattern(13) };
export const ReuiToggle14 = { name: 'Mute toggle', ...pattern(14) };
