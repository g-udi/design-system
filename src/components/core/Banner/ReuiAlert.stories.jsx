// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'alert',
  import.meta.glob('../../../../.storybook/fixtures/reui/alert/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/alert/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Banner', tags: ['autodocs'], ...catalogueMeta('alert') };

export const ReuiAlert1 = { name: 'Alert: Basic alert', ...pattern(1) };
export const ReuiAlert2 = { name: 'Alert: Alert with icon', ...pattern(2) };
export const ReuiAlert3 = { name: 'Alert: Alert with icon and action buttons', ...pattern(3) };
export const ReuiAlert4 = { name: 'Alert: Destructive alert with icon and action buttons', ...pattern(4) };
export const ReuiAlert5 = { name: 'Alert: Info alert with icon and action buttons', ...pattern(5) };
export const ReuiAlert6 = { name: 'Alert: Success alert', ...pattern(6) };
export const ReuiAlert7 = { name: 'Alert: Warning alert', ...pattern(7) };
export const ReuiAlert8 = { name: 'Alert: Error alert', ...pattern(8) };
export const ReuiAlert9 = { name: 'Alert: Invert alert', ...pattern(9) };
export const ReuiAlert10 = { name: 'Alert: Alert with icon and action buttons', ...pattern(10) };
export const ReuiAlert11 = { name: 'Alert: Alert with description and action buttons', ...pattern(11) };
export const ReuiAlert12 = { name: 'Alert: Alert integrated within a Frame with reset borders', ...pattern(12) };
export const ReuiAlert13 = { name: 'Alert: Stacked alerts within a Frame', ...pattern(13) };
export const ReuiAlert14 = { name: 'Alert: Alert with actions integrated within a Frame', ...pattern(14) };
export const ReuiAlert15 = { name: 'Alert: Inverted alert variant', ...pattern(15) };
export const ReuiAlert16 = { name: 'Alert: Urgent billing notice', ...pattern(16) };
export const ReuiAlert17 = { name: 'Alert: Service status summary stacked within a frame', ...pattern(17) };
export const ReuiAlert18 = { name: 'Alert: Feature discovery alert', ...pattern(18) };
export const ReuiAlert19 = { name: 'Alert: User message notification alert', ...pattern(19) };
export const ReuiAlert20 = { name: 'Alert: User message notification alert', ...pattern(20) };
