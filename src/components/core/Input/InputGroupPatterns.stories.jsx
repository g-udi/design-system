import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'input-group',
  import.meta.glob('../../../../.storybook/fixtures/patterns/input-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/input-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Input', tags: ['autodocs'], ...catalogueMeta('input-group') };

export const InputGroupPattern1 = { name: 'Basic input group', ...pattern(1) };
export const InputGroupPattern2 = { name: 'Input group in disabled state', ...pattern(2) };
export const InputGroupPattern3 = { name: 'Input group in invalid state', ...pattern(3) };
export const InputGroupPattern4 = { name: 'Input group with prefix icon', ...pattern(4) };
export const InputGroupPattern5 = { name: 'Input group with suffix icon', ...pattern(5) };
export const InputGroupPattern6 = { name: 'Input group with both prefix and suffix icons', ...pattern(6) };
export const InputGroupPattern7 = { name: 'Input group with prefix text addon', ...pattern(7) };
export const InputGroupPattern8 = { name: 'Input group with suffix text addon', ...pattern(8) };
export const InputGroupPattern9 = { name: 'Input group with both prefix and suffix text addons', ...pattern(9) };
export const InputGroupPattern10 = { name: 'Input group with action button addon', ...pattern(10) };
export const InputGroupPattern11 = { name: 'Input group with icon button action', ...pattern(11) };
export const InputGroupPattern12 = { name: 'Input group with dropdown menu selection', ...pattern(12) };
export const InputGroupPattern13 = { name: 'Input group with keyboard shortcut', ...pattern(13) };
export const InputGroupPattern14 = { name: 'Input group with tooltip action', ...pattern(14) };
export const InputGroupPattern15 = { name: 'Input group with loading spinner', ...pattern(15) };
export const InputGroupPattern16 = { name: 'Input group with block-start addon', ...pattern(16) };
export const InputGroupPattern17 = { name: 'Textarea input group with dynamic character limit', ...pattern(17) };
export const InputGroupPattern18 = { name: 'AI chat textarea with toolbar actions', ...pattern(18) };
export const InputGroupPattern19 = { name: 'AI chat with file and context attachments', ...pattern(19) };
export const InputGroupPattern20 = { name: 'Input group demonstrating label usage', ...pattern(20) };
export const InputGroupPattern21 = { name: 'Input group with several trailing actions', ...pattern(21) };
export const InputGroupPattern22 = { name: 'Input group with popover trigger addon', ...pattern(22) };
export const InputGroupPattern23 = { name: 'Input group with icon and multi-key shortcut', ...pattern(23) };
export const InputGroupPattern24 = { name: 'Input group with success indicator circle', ...pattern(24) };
export const InputGroupPattern25 = { name: 'Input group with search results count', ...pattern(25) };
export const InputGroupPattern26 = { name: 'Textarea input group with action buttons', ...pattern(26) };
export const InputGroupPattern27 = { name: 'Input group inside a button group', ...pattern(27) };
export const InputGroupPattern28 = { name: 'Input group with a trailing menu button', ...pattern(28) };
export const InputGroupPattern29 = { name: 'Pill-shaped input group with a category dropdown at the end', ...pattern(29) };
export const InputGroupPattern30 = { name: 'Input group with inline addons', ...pattern(30) };
export const InputGroupPattern31 = { name: 'Input group with inline start and block-end addon', ...pattern(31) };
export const InputGroupPattern32 = { name: 'Member row with avatar, email and role selection', ...pattern(32) };
export const InputGroupPattern33 = { name: 'Project save interface with status and action buttons', ...pattern(33) };
export const InputGroupPattern34 = { name: 'Pill-shaped AI prompt bar with voice and audio icons', ...pattern(34) };
export const InputGroupPattern35 = { name: 'Password input with visibility toggle', ...pattern(35) };
export const InputGroupPattern36 = { name: 'API request input with method selector and send action', ...pattern(36) };
export const InputGroupPattern37 = { name: 'Order search input with status filter', ...pattern(37) };
export const InputGroupPattern38 = { name: 'Company search input with region selector', ...pattern(38) };
export const InputGroupPattern39 = { name: 'Contact search input with filter and actions menu', ...pattern(39) };
export const InputGroupPattern40 = { name: 'Share link input with visibility selector and copy action', ...pattern(40) };
