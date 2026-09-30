// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'kbd',
  import.meta.glob('../../../../.storybook/fixtures/reui/kbd/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/kbd/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Kbd', tags: ['autodocs'], ...catalogueMeta('kbd') };

export const ReuiKbd1 = { name: 'Basic keys', ...pattern(1) };
export const ReuiKbd2 = { name: 'Grouped keys', ...pattern(2) };
export const ReuiKbd3 = { name: 'Keys with icons', ...pattern(3) };
export const ReuiKbd4 = { name: 'Key inside an input', ...pattern(4) };
export const ReuiKbd5 = { name: 'Shortcut in a tooltip', ...pattern(5) };
export const ReuiKbd6 = { name: 'Shortcut reference list', ...pattern(6) };
