// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'input-group',
  import.meta.glob('../../../../.storybook/fixtures/reui/input-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/input-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Input', tags: ['autodocs'], ...catalogueMeta('input-group') };

export const ReuiInputGroup1 = { name: 'Basic input group', ...pattern(1) };
export const ReuiInputGroup2 = { name: 'Input group in disabled state', ...pattern(2) };
export const ReuiInputGroup3 = { name: 'Input group in invalid state', ...pattern(3) };
export const ReuiInputGroup4 = { name: 'Input group with prefix icon', ...pattern(4) };
export const ReuiInputGroup5 = { name: 'Input group with suffix icon', ...pattern(5) };
export const ReuiInputGroup6 = { name: 'Input group with both prefix and suffix icons', ...pattern(6) };
export const ReuiInputGroup7 = { name: 'Input group with prefix text addon', ...pattern(7) };
export const ReuiInputGroup8 = { name: 'Input group with suffix text addon', ...pattern(8) };
export const ReuiInputGroup9 = { name: 'Input group with both prefix and suffix text addons', ...pattern(9) };
export const ReuiInputGroup10 = { name: 'Input group with action button addon', ...pattern(10) };
export const ReuiInputGroup11 = { name: 'Input group with icon button action', ...pattern(11) };
export const ReuiInputGroup12 = { name: 'Input group with dropdown menu selection', ...pattern(12) };
export const ReuiInputGroup13 = { name: 'Input group with keyboard shortcut', ...pattern(13) };
export const ReuiInputGroup14 = { name: 'Input group with tooltip action', ...pattern(14) };
export const ReuiInputGroup15 = { name: 'Input group with loading spinner', ...pattern(15) };
export const ReuiInputGroup16 = { name: 'Input group with block-start addon', ...pattern(16) };
export const ReuiInputGroup17 = { name: 'Textarea input group with dynamic character limit', ...pattern(17) };
export const ReuiInputGroup18 = { name: 'AI chat textarea with toolbar actions', ...pattern(18) };
export const ReuiInputGroup19 = { name: 'AI chat with file and context attachments', ...pattern(19) };
export const ReuiInputGroup20 = { name: 'Input group demonstrating label usage', ...pattern(20) };
export const ReuiInputGroup21 = { name: 'Input group with several trailing actions', ...pattern(21) };
export const ReuiInputGroup22 = { name: 'Input group with popover trigger addon', ...pattern(22) };
export const ReuiInputGroup23 = { name: 'Input group with icon and multi-key shortcut', ...pattern(23) };
export const ReuiInputGroup24 = { name: 'Input group with success indicator circle', ...pattern(24) };
export const ReuiInputGroup25 = { name: 'Input group with search results count', ...pattern(25) };
export const ReuiInputGroup26 = { name: 'Textarea input group with action buttons', ...pattern(26) };
export const ReuiInputGroup27 = { name: 'Input group inside a button group', ...pattern(27) };
export const ReuiInputGroup28 = { name: 'Input group with a trailing menu button', ...pattern(28) };
export const ReuiInputGroup29 = { name: 'Pill-shaped input group with a category dropdown at the end', ...pattern(29) };
export const ReuiInputGroup30 = { name: 'Input group with inline addons', ...pattern(30) };
export const ReuiInputGroup31 = { name: 'Input group with inline start and block-end addon', ...pattern(31) };
export const ReuiInputGroup32 = { name: 'Member row with avatar, email and role selection', ...pattern(32) };
export const ReuiInputGroup33 = { name: 'Project save interface with status and action buttons', ...pattern(33) };
export const ReuiInputGroup34 = { name: 'Pill-shaped AI prompt bar with voice and audio icons', ...pattern(34) };
export const ReuiInputGroup35 = { name: 'Password input with visibility toggle', ...pattern(35) };
export const ReuiInputGroup36 = { name: 'API request input with method selector and send action', ...pattern(36) };
export const ReuiInputGroup37 = { name: 'Order search input with status filter', ...pattern(37) };
export const ReuiInputGroup38 = { name: 'Company search input with region selector', ...pattern(38) };
export const ReuiInputGroup39 = { name: 'Contact search input with filter and actions menu', ...pattern(39) };
export const ReuiInputGroup40 = { name: 'Share link input with visibility selector and copy action', ...pattern(40) };
