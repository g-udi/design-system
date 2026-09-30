// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'alert',
  import.meta.glob('../../../../.storybook/fixtures/reui/alert/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/alert/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Banner', tags: ['autodocs'], ...catalogueMeta('alert') };

export const ReuiAlert1 = { name: 'Alert: Basic', ...pattern(1) };
export const ReuiAlert2 = { name: 'Alert: With icon', ...pattern(2) };
export const ReuiAlert3 = { name: 'Alert: Icon, title, and action', ...pattern(3) };
export const ReuiAlert4 = { name: 'Alert: Destructive with actions', ...pattern(4) };
export const ReuiAlert5 = { name: 'Alert: Info with actions', ...pattern(5) };
export const ReuiAlert6 = { name: 'Alert: Success', ...pattern(6) };
export const ReuiAlert7 = { name: 'Alert: Warning', ...pattern(7) };
export const ReuiAlert8 = { name: 'Alert: Error', ...pattern(8) };
export const ReuiAlert9 = { name: 'Alert: Inverted', ...pattern(9) };
export const ReuiAlert10 = { name: 'Alert: Icon and action without title', ...pattern(10) };
export const ReuiAlert11 = { name: 'Alert: Description and actions', ...pattern(11) };
export const ReuiAlert12 = { name: 'Alert: Inside a frame', ...pattern(12) };
export const ReuiAlert13 = { name: 'Alert: Stacked in a frame', ...pattern(13) };
export const ReuiAlert14 = { name: 'Alert: Actions inside a frame', ...pattern(14) };
export const ReuiAlert15 = { name: 'Alert: Inverted feature promo', ...pattern(15) };
export const ReuiAlert16 = { name: 'Alert: Urgent billing notice', ...pattern(16) };
export const ReuiAlert17 = { name: 'Alert: Service status summary', ...pattern(17) };
export const ReuiAlert18 = { name: 'Alert: Feature discovery', ...pattern(18) };
export const ReuiAlert19 = { name: 'Alert: Message notification', ...pattern(19) };
export const ReuiAlert20 = { name: 'Alert: Inverted message notification', ...pattern(20) };
