import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'alert',
  import.meta.glob('../../../../.storybook/fixtures/patterns/alert/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/alert/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Banner', tags: ['autodocs'], ...catalogueMeta('alert') };

export const AlertPattern1 = { name: 'Alert: Basic', ...pattern(1) };
export const AlertPattern2 = { name: 'Alert: With icon', ...pattern(2) };
export const AlertPattern3 = { name: 'Alert: Icon, title, and action', ...pattern(3) };
export const AlertPattern4 = { name: 'Alert: Destructive with actions', ...pattern(4) };
export const AlertPattern5 = { name: 'Alert: Info with actions', ...pattern(5) };
export const AlertPattern6 = { name: 'Alert: Success', ...pattern(6) };
export const AlertPattern7 = { name: 'Alert: Warning', ...pattern(7) };
export const AlertPattern8 = { name: 'Alert: Error', ...pattern(8) };
export const AlertPattern9 = { name: 'Alert: Inverted', ...pattern(9) };
export const AlertPattern10 = { name: 'Alert: Icon and action without title', ...pattern(10) };
export const AlertPattern11 = { name: 'Alert: Description and actions', ...pattern(11) };
export const AlertPattern12 = { name: 'Alert: Inside a frame', ...pattern(12) };
export const AlertPattern13 = { name: 'Alert: Stacked in a frame', ...pattern(13) };
export const AlertPattern14 = { name: 'Alert: Actions inside a frame', ...pattern(14) };
export const AlertPattern15 = { name: 'Alert: Inverted feature promo', ...pattern(15) };
export const AlertPattern16 = { name: 'Alert: Urgent billing notice', ...pattern(16) };
export const AlertPattern17 = { name: 'Alert: Service status summary', ...pattern(17) };
export const AlertPattern18 = { name: 'Alert: Feature discovery', ...pattern(18) };
export const AlertPattern19 = { name: 'Alert: Message notification', ...pattern(19) };
export const AlertPattern20 = { name: 'Alert: Inverted message notification', ...pattern(20) };
