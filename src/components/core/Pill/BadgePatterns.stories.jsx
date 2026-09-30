import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'badge',
  import.meta.glob('../../../../.storybook/fixtures/patterns/badge/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/badge/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Pill', tags: ['autodocs'], ...catalogueMeta('badge') };

export const BadgePattern1 = { name: 'Default badge', ...pattern(1) };
export const BadgePattern2 = { name: 'Secondary badge', ...pattern(2) };
export const BadgePattern3 = { name: 'Destructive badge', ...pattern(3) };
export const BadgePattern4 = { name: 'Success badge', ...pattern(4) };
export const BadgePattern5 = { name: 'Info badge', ...pattern(5) };
export const BadgePattern6 = { name: 'Warning badge', ...pattern(6) };
export const BadgePattern7 = { name: 'Outline badge', ...pattern(7) };
export const BadgePattern8 = { name: 'Primary outline badge', ...pattern(8) };
export const BadgePattern9 = { name: 'Destructive outline badge', ...pattern(9) };
export const BadgePattern10 = { name: 'Info outline badge', ...pattern(10) };
export const BadgePattern11 = { name: 'Success outline badge', ...pattern(11) };
export const BadgePattern12 = { name: 'Warning outline badge', ...pattern(12) };
export const BadgePattern13 = { name: 'Primary light badge', ...pattern(13) };
export const BadgePattern14 = { name: 'Destructive light badge', ...pattern(14) };
export const BadgePattern15 = { name: 'Success light badge', ...pattern(15) };
export const BadgePattern16 = { name: 'Info light badge', ...pattern(16) };
export const BadgePattern17 = { name: 'Warning light badge', ...pattern(17) };
export const BadgePattern18 = { name: 'Badge sizes', ...pattern(18) };
export const BadgePattern19 = { name: 'Count and label badges', ...pattern(19) };
export const BadgePattern20 = { name: 'Badge with icon', ...pattern(20) };
export const BadgePattern21 = { name: 'Dismissible badge', ...pattern(21) };
export const BadgePattern22 = { name: 'Badge with status dot', ...pattern(22) };
export const BadgePattern23 = { name: 'Badge as a link', ...pattern(23) };
export const BadgePattern24 = { name: 'Badge with avatar', ...pattern(24) };
export const BadgePattern25 = { name: 'Badge with flag', ...pattern(25) };
