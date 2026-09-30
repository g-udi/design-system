// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'date-selector',
  import.meta.glob('../../../../.storybook/fixtures/reui/date-selector/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/date-selector/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Calendar', tags: ['autodocs'], ...catalogueMeta('date-selector') };

export const ReuiDateSelector1 = { name: 'Date Selector: Basic date selector', ...pattern(1) };
export const ReuiDateSelector2 = { name: 'Date Selector: Date selector with popover', ...pattern(2) };
export const ReuiDateSelector3 = { name: 'Date Selector: Date selector with dialog', ...pattern(3) };
export const ReuiDateSelector4 = { name: 'Date Selector: Date selector with dropdown menu', ...pattern(4) };
