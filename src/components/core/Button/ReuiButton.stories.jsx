// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'button',
  import.meta.glob('../../../../.storybook/fixtures/reui/button/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/button/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Button', tags: ['autodocs'], ...catalogueMeta('button') };

export const ReuiButton1 = { name: 'Default', ...pattern(1) };
export const ReuiButton2 = { name: 'Secondary', ...pattern(2) };
export const ReuiButton3 = { name: 'Outline', ...pattern(3) };
export const ReuiButton4 = { name: 'Ghost', ...pattern(4) };
export const ReuiButton5 = { name: 'Destructive', ...pattern(5) };
export const ReuiButton6 = { name: 'Link', ...pattern(6) };
export const ReuiButton7 = { name: 'Extra small', ...pattern(7) };
export const ReuiButton8 = { name: 'Small', ...pattern(8) };
export const ReuiButton9 = { name: 'Large', ...pattern(9) };
export const ReuiButton10 = { name: 'Disabled', ...pattern(10) };
export const ReuiButton11 = { name: 'Icon only', ...pattern(11) };
export const ReuiButton12 = { name: 'Trailing icon', ...pattern(12) };
export const ReuiButton13 = { name: 'Loading', ...pattern(13) };
export const ReuiButton14 = { name: 'Leading icon', ...pattern(14) };
export const ReuiButton15 = { name: 'Invalid', ...pattern(15) };
export const ReuiButton16 = { name: 'Secondary with leading icon', ...pattern(16) };
export const ReuiButton17 = { name: 'Secondary with trailing icon', ...pattern(17) };
export const ReuiButton18 = { name: 'Outline with leading icon', ...pattern(18) };
export const ReuiButton19 = { name: 'Outline with trailing icon', ...pattern(19) };
export const ReuiButton20 = { name: 'Ghost with leading icon', ...pattern(20) };
export const ReuiButton21 = { name: 'Ghost with trailing icon', ...pattern(21) };
export const ReuiButton22 = { name: 'Destructive with leading icon', ...pattern(22) };
export const ReuiButton23 = { name: 'Destructive with trailing icon', ...pattern(23) };
export const ReuiButton24 = { name: 'Extra small icon only', ...pattern(24) };
export const ReuiButton25 = { name: 'Small icon only', ...pattern(25) };
export const ReuiButton26 = { name: 'Large icon only', ...pattern(26) };
export const ReuiButton27 = { name: 'Next.js link', ...pattern(27) };
export const ReuiButton28 = { name: 'Link with leading icon', ...pattern(28) };
export const ReuiButton29 = { name: 'Link with trailing icon', ...pattern(29) };
export const ReuiButton30 = { name: 'Large with leading icon', ...pattern(30) };
export const ReuiButton31 = { name: 'Large with trailing icon', ...pattern(31) };
export const ReuiButton32 = { name: 'Outline invalid', ...pattern(32) };
export const ReuiButton33 = { name: 'Ghost invalid', ...pattern(33) };
export const ReuiButton34 = { name: 'Email sign-in', ...pattern(34) };
export const ReuiButton35 = { name: 'More and less toggle', ...pattern(35) };
export const ReuiButton36 = { name: 'Social icon sign-in', ...pattern(36) };
export const ReuiButton37 = { name: 'Like with count', ...pattern(37) };
export const ReuiButton38 = { name: 'Star with count', ...pattern(38) };
export const ReuiButton39 = { name: 'Unread badge', ...pattern(39) };
export const ReuiButton40 = { name: 'Icon, label, and shortcut', ...pattern(40) };
export const ReuiButton41 = { name: 'Copy with feedback', ...pattern(41) };
export const ReuiButton42 = { name: 'Icon-only copy with feedback', ...pattern(42) };
export const ReuiButton43 = { name: 'Menu and close toggle', ...pattern(43) };
export const ReuiButton44 = { name: 'Async loading and success', ...pattern(44) };
export const ReuiButton45 = { name: 'Outline with count badge', ...pattern(45) };
export const ReuiButton46 = { name: 'Status dot badge', ...pattern(46) };
export const ReuiButton47 = { name: 'Ghost with status badge', ...pattern(47) };
export const ReuiButton48 = { name: 'Icon with notification badge', ...pattern(48) };
export const ReuiButton49 = { name: 'Go back link', ...pattern(49) };
export const ReuiButton50 = { name: 'Animated go back link', ...pattern(50) };
export const ReuiButton51 = { name: 'Expands from icon to label', ...pattern(51) };
export const ReuiButton52 = { name: 'Title and description', ...pattern(52) };
export const ReuiButton53 = { name: 'Hover-reveal sliding icon', ...pattern(53) };
export const ReuiButton54 = { name: 'Shortcut tooltip', ...pattern(54) };
export const ReuiButton55 = { name: 'With avatar', ...pattern(55) };
export const ReuiButton56 = { name: 'Outline with avatar', ...pattern(56) };
export const ReuiButton57 = { name: 'Small with avatar', ...pattern(57) };
export const ReuiButton58 = { name: 'Small outline with avatar', ...pattern(58) };
export const ReuiButton59 = { name: 'Social sign-in with labels', ...pattern(59) };
export const ReuiButton60 = { name: 'Social icon-only in brand colours', ...pattern(60) };
export const ReuiButton61 = { name: 'Animated theme toggle', ...pattern(61) };
