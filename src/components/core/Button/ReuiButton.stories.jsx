// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'button',
  import.meta.glob('../../../../.storybook/fixtures/reui/button/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/button/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Button', tags: ['autodocs'], ...catalogueMeta('button') };

export const ReuiButton1 = { name: 'Default button', ...pattern(1) };
export const ReuiButton2 = { name: 'Secondary button', ...pattern(2) };
export const ReuiButton3 = { name: 'Outline button', ...pattern(3) };
export const ReuiButton4 = { name: 'Ghost button', ...pattern(4) };
export const ReuiButton5 = { name: 'Destructive button', ...pattern(5) };
export const ReuiButton6 = { name: 'Link button variant', ...pattern(6) };
export const ReuiButton7 = { name: 'Extra small button', ...pattern(7) };
export const ReuiButton8 = { name: 'Small button', ...pattern(8) };
export const ReuiButton9 = { name: 'Large button', ...pattern(9) };
export const ReuiButton10 = { name: 'Disabled button', ...pattern(10) };
export const ReuiButton11 = { name: 'Icon button', ...pattern(11) };
export const ReuiButton12 = { name: 'Button with an icon on the right', ...pattern(12) };
export const ReuiButton13 = { name: 'Button in a loading state', ...pattern(13) };
export const ReuiButton14 = { name: 'Button with an icon on the left', ...pattern(14) };
export const ReuiButton15 = { name: 'Button with an invalid state highlight', ...pattern(15) };
export const ReuiButton16 = { name: 'Secondary button with an icon on the left', ...pattern(16) };
export const ReuiButton17 = { name: 'Secondary button with an icon on the right', ...pattern(17) };
export const ReuiButton18 = { name: 'Outline button with an icon on the left', ...pattern(18) };
export const ReuiButton19 = { name: 'Outline button with an icon on the right', ...pattern(19) };
export const ReuiButton20 = { name: 'Ghost button with an icon on the left', ...pattern(20) };
export const ReuiButton21 = { name: 'Ghost button with an icon on the right', ...pattern(21) };
export const ReuiButton22 = { name: 'Destructive button with an icon on the left', ...pattern(22) };
export const ReuiButton23 = { name: 'Destructive button with an icon on the right', ...pattern(23) };
export const ReuiButton24 = { name: 'Extra small icon button', ...pattern(24) };
export const ReuiButton25 = { name: 'Small icon button', ...pattern(25) };
export const ReuiButton26 = { name: 'Large (lg) icon-only button', ...pattern(26) };
export const ReuiButton27 = { name: 'Button rendered as a Next.js Link', ...pattern(27) };
export const ReuiButton28 = { name: 'Link button with an icon on the left', ...pattern(28) };
export const ReuiButton29 = { name: 'Link button with an icon on the right', ...pattern(29) };
export const ReuiButton30 = { name: 'Large button with an icon on the left', ...pattern(30) };
export const ReuiButton31 = { name: 'Large button with an icon on the right', ...pattern(31) };
export const ReuiButton32 = { name: 'Outline button with an invalid state', ...pattern(32) };
export const ReuiButton33 = { name: 'Ghost button with an invalid state', ...pattern(33) };
export const ReuiButton34 = { name: 'Button with an icon on the left', ...pattern(34) };
export const ReuiButton35 = { name: 'Ghost button with more/less toggle', ...pattern(35) };
export const ReuiButton36 = { name: 'Social login buttons with Remix Icons', ...pattern(36) };
export const ReuiButton37 = { name: 'Outline like button with count', ...pattern(37) };
export const ReuiButton38 = { name: 'Star button with count', ...pattern(38) };
export const ReuiButton39 = { name: 'Button with an unread badge', ...pattern(39) };
export const ReuiButton40 = { name: 'Button with icon, label, and shortcut keys', ...pattern(40) };
export const ReuiButton41 = { name: 'Copy button with feedback', ...pattern(41) };
export const ReuiButton42 = { name: 'Icon-only copy button with feedback', ...pattern(42) };
export const ReuiButton43 = { name: 'Animated hamburger / close toggle button', ...pattern(43) };
export const ReuiButton44 = { name: 'Async action button with loading and success states', ...pattern(44) };
export const ReuiButton45 = { name: 'Outline button with inline count badge', ...pattern(45) };
export const ReuiButton46 = { name: 'Button with status dot badge', ...pattern(46) };
export const ReuiButton47 = { name: 'Ghost button with a status badge', ...pattern(47) };
export const ReuiButton48 = { name: 'Icon button with notification badge', ...pattern(48) };
export const ReuiButton49 = { name: 'Go back link button', ...pattern(49) };
export const ReuiButton50 = { name: 'Go back link button with animation', ...pattern(50) };
export const ReuiButton51 = { name: 'Expanding button from icon to label', ...pattern(51) };
export const ReuiButton52 = { name: 'Multi-line button with icon, title & description', ...pattern(52) };
export const ReuiButton53 = { name: 'Sliding Icon Button (Hover reveal)', ...pattern(53) };
export const ReuiButton54 = { name: 'Shortcut Tooltip Button (Kbd hints)', ...pattern(54) };
export const ReuiButton55 = { name: 'Button with avatar', ...pattern(55) };
export const ReuiButton56 = { name: 'Outline button with avatar', ...pattern(56) };
export const ReuiButton57 = { name: 'Small button with avatar', ...pattern(57) };
export const ReuiButton58 = { name: 'Small outline button with avatar', ...pattern(58) };
export const ReuiButton59 = { name: 'Social login buttons with Remix icons', ...pattern(59) };
export const ReuiButton60 = { name: 'Social icon-only buttons with Remix icons', ...pattern(60) };
export const ReuiButton61 = { name: 'Theme toggle button with animated moon and sun icons', ...pattern(61) };
