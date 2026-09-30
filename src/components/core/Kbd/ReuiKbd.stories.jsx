// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'kbd',
  import.meta.glob('../../../../.storybook/fixtures/reui/kbd/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/kbd/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Kbd', tags: ['autodocs'], ...catalogueMeta('kbd') };

export const ReuiKbd1 = { name: 'Basic keyboard keys', ...pattern(1) };
export const ReuiKbd2 = { name: 'Keyboard keys grouped together', ...pattern(2) };
export const ReuiKbd3 = { name: 'Keyboard keys combined with icons', ...pattern(3) };
export const ReuiKbd4 = { name: 'Keyboard key within an input', ...pattern(4) };
export const ReuiKbd5 = { name: 'Keyboard shortcut in a tooltip', ...pattern(5) };
export const ReuiKbd6 = { name: 'Keyboard shortcuts reference list', ...pattern(6) };
