// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'input-group',
  import.meta.glob('../../../../.storybook/fixtures/reui/input-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/input-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Input', tags: ['autodocs'], ...catalogueMeta('input-group') };

export const ReuiInputGroup1 = { name: 'Input Group: Basic input group', ...pattern(1) };
export const ReuiInputGroup2 = { name: 'Input Group: Input group in disabled state', ...pattern(2) };
export const ReuiInputGroup3 = { name: 'Input Group: Input group in invalid state', ...pattern(3) };
export const ReuiInputGroup4 = { name: 'Input Group: Input group with prefix icon', ...pattern(4) };
export const ReuiInputGroup5 = { name: 'Input Group: Input group with suffix icon', ...pattern(5) };
export const ReuiInputGroup6 = { name: 'Input Group: Input group with both prefix and suffix icons', ...pattern(6) };
export const ReuiInputGroup7 = { name: 'Input Group: Input group with prefix text addon', ...pattern(7) };
export const ReuiInputGroup8 = { name: 'Input Group: Input group with suffix text addon', ...pattern(8) };
export const ReuiInputGroup9 = { name: 'Input Group: Input group with both prefix and suffix text addons', ...pattern(9) };
export const ReuiInputGroup10 = { name: 'Input Group: Input group with action button addon', ...pattern(10) };
export const ReuiInputGroup11 = { name: 'Input Group: Input group with icon button action', ...pattern(11) };
export const ReuiInputGroup12 = { name: 'Input Group: Input group with dropdown menu selection', ...pattern(12) };
export const ReuiInputGroup13 = { name: 'Input Group: Input group with keyboard shortcut (Kbd)', ...pattern(13) };
export const ReuiInputGroup14 = { name: 'Input Group: Input group with tooltip action', ...pattern(14) };
export const ReuiInputGroup15 = { name: 'Input Group: Input group with loading spinner', ...pattern(15) };
export const ReuiInputGroup16 = { name: 'Input Group: Input group with block-start addon', ...pattern(16) };
export const ReuiInputGroup17 = { name: 'Input Group: Textarea input group with dynamic character limit', ...pattern(17) };
export const ReuiInputGroup18 = { name: 'Input Group: AI Chat textarea with rich toolbar actions', ...pattern(18) };
export const ReuiInputGroup19 = { name: 'Input Group: AI Chat interface with file and context attachments', ...pattern(19) };
export const ReuiInputGroup20 = { name: 'Input Group: Input group demonstrating label usage', ...pattern(20) };
export const ReuiInputGroup21 = { name: 'Input Group: Input group with multiple icons/buttons at the end', ...pattern(21) };
export const ReuiInputGroup22 = { name: 'Input Group: Input group with popover trigger addon', ...pattern(22) };
export const ReuiInputGroup23 = { name: 'Input Group: Input group with Sparkles icon and complex Kbd shortcut', ...pattern(23) };
export const ReuiInputGroup24 = { name: 'Input Group: Input group with success indicator circle', ...pattern(24) };
export const ReuiInputGroup25 = { name: 'Input Group: Input group with search results count', ...pattern(25) };
export const ReuiInputGroup26 = { name: 'Input Group: Textarea input group with action buttons', ...pattern(26) };
export const ReuiInputGroup27 = { name: 'Input Group: Input group wrapped in a button group with text prefixes/suffixes', ...pattern(27) };
export const ReuiInputGroup28 = { name: 'Input Group: Input group with a menu button (three dots) at the end', ...pattern(28) };
export const ReuiInputGroup29 = { name: 'Input Group: Pill-shaped input group with a category dropdown at the end', ...pattern(29) };
export const ReuiInputGroup30 = { name: 'Input Group: Input group with inline addons (no separating borders)', ...pattern(30) };
export const ReuiInputGroup31 = { name: 'Input Group: Input group with inline start and block-end addon', ...pattern(31) };
export const ReuiInputGroup32 = { name: 'Input Group: Member row with avatar, email and role selection', ...pattern(32) };
export const ReuiInputGroup33 = { name: 'Input Group: Project save interface with status and action buttons', ...pattern(33) };
export const ReuiInputGroup34 = { name: 'Input Group: Pill-shaped AI prompt bar with voice and audio icons', ...pattern(34) };
export const ReuiInputGroup35 = { name: 'Input Group: Password input with visibility toggle', ...pattern(35) };
export const ReuiInputGroup36 = { name: 'Input Group: API request input with method selector and send action', ...pattern(36) };
export const ReuiInputGroup37 = { name: 'Input Group: Order search input with status filter', ...pattern(37) };
export const ReuiInputGroup38 = { name: 'Input Group: Company search input with region selector', ...pattern(38) };
export const ReuiInputGroup39 = { name: 'Input Group: Contact search input with filter and actions menu', ...pattern(39) };
export const ReuiInputGroup40 = { name: 'Input Group: Share link input with visibility selector and copy action', ...pattern(40) };
