import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'button',
  import.meta.glob('../../../../.storybook/fixtures/patterns/button/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/button/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Button', tags: ['autodocs'], ...catalogueMeta('button') };

export const ButtonPattern1 = { name: 'Default', ...pattern(1) };
export const ButtonPattern2 = { name: 'Secondary', ...pattern(2) };
export const ButtonPattern3 = { name: 'Outline', ...pattern(3) };
export const ButtonPattern4 = { name: 'Ghost', ...pattern(4) };
export const ButtonPattern5 = { name: 'Destructive', ...pattern(5) };
export const ButtonPattern6 = { name: 'Link', ...pattern(6) };
export const ButtonPattern7 = { name: 'Extra small', ...pattern(7) };
export const ButtonPattern8 = { name: 'Small', ...pattern(8) };
export const ButtonPattern9 = { name: 'Large', ...pattern(9) };
export const ButtonPattern10 = { name: 'Disabled', ...pattern(10) };
export const ButtonPattern11 = { name: 'Icon only', ...pattern(11) };
export const ButtonPattern12 = { name: 'Trailing icon', ...pattern(12) };
export const ButtonPattern13 = { name: 'Loading', ...pattern(13) };
export const ButtonPattern14 = { name: 'Leading icon', ...pattern(14) };
export const ButtonPattern15 = { name: 'Invalid', ...pattern(15) };
export const ButtonPattern16 = { name: 'Secondary with leading icon', ...pattern(16) };
export const ButtonPattern17 = { name: 'Secondary with trailing icon', ...pattern(17) };
export const ButtonPattern18 = { name: 'Outline with leading icon', ...pattern(18) };
export const ButtonPattern19 = { name: 'Outline with trailing icon', ...pattern(19) };
export const ButtonPattern20 = { name: 'Ghost with leading icon', ...pattern(20) };
export const ButtonPattern21 = { name: 'Ghost with trailing icon', ...pattern(21) };
export const ButtonPattern22 = { name: 'Destructive with leading icon', ...pattern(22) };
export const ButtonPattern23 = { name: 'Destructive with trailing icon', ...pattern(23) };
export const ButtonPattern24 = { name: 'Extra small icon only', ...pattern(24) };
export const ButtonPattern25 = { name: 'Small icon only', ...pattern(25) };
export const ButtonPattern26 = { name: 'Large icon only', ...pattern(26) };
export const ButtonPattern27 = { name: 'Next.js link', ...pattern(27) };
export const ButtonPattern28 = { name: 'Link with leading icon', ...pattern(28) };
export const ButtonPattern29 = { name: 'Link with trailing icon', ...pattern(29) };
export const ButtonPattern30 = { name: 'Large with leading icon', ...pattern(30) };
export const ButtonPattern31 = { name: 'Large with trailing icon', ...pattern(31) };
export const ButtonPattern32 = { name: 'Outline invalid', ...pattern(32) };
export const ButtonPattern33 = { name: 'Ghost invalid', ...pattern(33) };
export const ButtonPattern34 = { name: 'Email sign-in', ...pattern(34) };
export const ButtonPattern35 = { name: 'More and less toggle', ...pattern(35) };
export const ButtonPattern36 = { name: 'Social icon sign-in', ...pattern(36) };
export const ButtonPattern37 = { name: 'Like with count', ...pattern(37) };
export const ButtonPattern38 = { name: 'Star with count', ...pattern(38) };
export const ButtonPattern39 = { name: 'Unread badge', ...pattern(39) };
export const ButtonPattern40 = { name: 'Icon, label, and shortcut', ...pattern(40) };
export const ButtonPattern41 = { name: 'Copy with feedback', ...pattern(41) };
export const ButtonPattern42 = { name: 'Icon-only copy with feedback', ...pattern(42) };
export const ButtonPattern43 = { name: 'Menu and close toggle', ...pattern(43) };
export const ButtonPattern44 = { name: 'Async loading and success', ...pattern(44) };
export const ButtonPattern45 = { name: 'Outline with count badge', ...pattern(45) };
export const ButtonPattern46 = { name: 'Status dot badge', ...pattern(46) };
export const ButtonPattern47 = { name: 'Ghost with status badge', ...pattern(47) };
export const ButtonPattern48 = { name: 'Icon with notification badge', ...pattern(48) };
export const ButtonPattern49 = { name: 'Go back link', ...pattern(49) };
export const ButtonPattern50 = { name: 'Animated go back link', ...pattern(50) };
export const ButtonPattern51 = { name: 'Expands from icon to label', ...pattern(51) };
export const ButtonPattern52 = { name: 'Title and description', ...pattern(52) };
export const ButtonPattern53 = { name: 'Hover-reveal sliding icon', ...pattern(53) };
export const ButtonPattern54 = { name: 'Shortcut tooltip', ...pattern(54) };
export const ButtonPattern55 = { name: 'With avatar', ...pattern(55) };
export const ButtonPattern56 = { name: 'Outline with avatar', ...pattern(56) };
export const ButtonPattern57 = { name: 'Small with avatar', ...pattern(57) };
export const ButtonPattern58 = { name: 'Small outline with avatar', ...pattern(58) };
export const ButtonPattern59 = { name: 'Social sign-in with labels', ...pattern(59) };
export const ButtonPattern60 = { name: 'Social icon-only in brand colours', ...pattern(60) };
export const ButtonPattern61 = { name: 'Animated theme toggle', ...pattern(61) };
